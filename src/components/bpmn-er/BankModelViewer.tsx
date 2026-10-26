"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ER_NODES,
  ER_EDGES,
  BPMN_NODES,
  BPMN_EDGES,
  BPMN_LANES,
  BPMN_PATHS,
  RELATIONAL_TABLES,
  SQL_DDL_SCRIPT,
  DiagramNode,
  DiagramEdge,
} from "./data";
import {
  Play,
  RotateCcw,
  Database,
  GitBranch,
  Layers,
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  Zap,
  Info,
  Maximize2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabMode = "er" | "bp";
type PathMode = "ok" | "no";

export function BankModelViewer() {
  const [tab, setTab] = useState<TabMode>("er");
  const [pathMode, setPathMode] = useState<PathMode>("ok");
  const [speed, setSpeed] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("loan");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeEdgeIds, setActiveEdgeIds] = useState<Set<string>>(new Set());
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [tokenPos, setTokenPos] = useState<{ x: number; y: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [isFullscreenHtmlOpen, setIsFullscreenHtmlOpen] = useState<boolean>(false);

  const animationRunRef = useRef<number>(0);
  const edgePathRefs = useRef<Record<string, SVGPathElement[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenFullscreenHtml = () => {
    setIsFullscreenHtmlOpen(true);
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}
  };

  const handleCloseFullscreenHtml = () => {
    setIsFullscreenHtmlOpen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
  };

  const activeNodeId = hoveredNodeId || selectedNodeId;

  // Find active node information
  const currentNode =
    tab === "er"
      ? ER_NODES.find((n) => n.id === activeNodeId) || ER_NODES[0]
      : BPMN_NODES.find((n) => n.id === activeNodeId) || BPMN_NODES[0];

  // Helper to compute line lengths and paths
  const getEdgePathPoints = (e: DiagramEdge, nodes: DiagramNode[]): [number, number][] => {
    if (e.p) return e.p;
    const a = nodes.find((n) => n.id === e.f);
    const b = nodes.find((n) => n.id === e.t);
    if (!a || !b) return [[0, 0], [0, 0]];
    return [[a.x, a.y], [b.x, b.y]];
  };

  const currentEdges = tab === "er" ? ER_EDGES : BPMN_EDGES;
  const currentNodes = tab === "er" ? ER_NODES : BPMN_NODES;

  // Run SVG diagram progressive drawing and token simulation
  const runAnimation = useCallback(async () => {
    const currentRun = ++animationRunRef.current;
    setIsAnimating(true);
    setProgress(0);
    setActiveEdgeIds(new Set());
    setActiveNodeIds(new Set());
    setTokenPos(null);

    const edges = tab === "er" ? ER_EDGES : BPMN_EDGES;
    const totalEdges = edges.length;
    const delayFactor = speed === 0 ? 0 : 1 / speed;

    const activatedEdges = new Set<string>();
    const activatedNodes = new Set<string>();

    // Initial brief delay
    if (delayFactor > 0) {
      await new Promise((r) => setTimeout(r, 150 * delayFactor));
    }

    // Step through each edge
    for (let i = 0; i < totalEdges; i++) {
      if (animationRunRef.current !== currentRun) return;

      const edge = edges[i];
      activatedNodes.add(edge.f);
      activatedEdges.add(edge.id);
      setActiveNodeIds(new Set(activatedNodes));
      setActiveEdgeIds(new Set(activatedEdges));

      const duration = speed === 0 ? 0 : Math.max(120, 280 * delayFactor);
      if (duration > 0) {
        await new Promise((r) => setTimeout(r, duration));
      }

      if (animationRunRef.current !== currentRun) return;
      activatedNodes.add(edge.t);
      setActiveNodeIds(new Set(activatedNodes));
      setProgress(Math.round(((i + 1) / totalEdges) * 100));
    }

    // BPMN Token Simulation
    if (tab === "bp") {
      const activePathIds = BPMN_PATHS[pathMode];
      for (const edgeId of activePathIds) {
        if (animationRunRef.current !== currentRun) return;
        const edge = BPMN_EDGES.find((e) => e.id === edgeId);
        if (!edge) continue;

        const pts = getEdgePathPoints(edge, BPMN_NODES);
        const subSegments: { p1: [number, number]; p2: [number, number]; len: number }[] = [];
        let totalLen = 0;

        for (let j = 1; j < pts.length; j++) {
          const p1 = pts[j - 1];
          const p2 = pts[j];
          const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
          subSegments.push({ p1, p2, len });
          totalLen += len;
        }

        const stepTime = speed === 0 ? 1 : Math.max(160, (totalLen * 4.5) * delayFactor);
        const startTime = performance.now();

        await new Promise<void>((resolve) => {
          function anim(time: number) {
            if (animationRunRef.current !== currentRun) {
              resolve();
              return;
            }
            const progressRatio = Math.min(1, (time - startTime) / stepTime);
            const targetDistance = totalLen * progressRatio;

            let accumulated = 0;
            let currentPt: { x: number; y: number } = { x: pts[0][0], y: pts[0][1] };

            for (const seg of subSegments) {
              if (targetDistance <= accumulated + seg.len) {
                const segProgress = (targetDistance - accumulated) / (seg.len || 1);
                currentPt = {
                  x: seg.p1[0] + (seg.p2[0] - seg.p1[0]) * segProgress,
                  y: seg.p1[1] + (seg.p2[1] - seg.p1[1]) * segProgress,
                };
                break;
              }
              accumulated += seg.len;
            }

            setTokenPos(currentPt);

            if (progressRatio < 1) {
              requestAnimationFrame(anim);
            } else {
              resolve();
            }
          }
          requestAnimationFrame(anim);
        });

        if (delayFactor > 0) {
          await new Promise((r) => setTimeout(r, 60 * delayFactor));
        }
      }

      if (animationRunRef.current === currentRun) {
        await new Promise((r) => setTimeout(r, 600));
        if (animationRunRef.current === currentRun) {
          setTokenPos(null);
        }
      }
    }

    if (animationRunRef.current === currentRun) {
      setIsAnimating(false);
    }
  }, [tab, speed, pathMode]);

  useEffect(() => {
    runAnimation();
    return () => {
      animationRunRef.current++;
    };
  }, [runAnimation]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_DDL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const getKindBadge = (k: DiagramNode["k"]) => {
    switch (k) {
      case "ent":
        return { label: "Entity Table", color: "bg-navy-900 text-white border-navy-700" };
      case "rel":
        return { label: "Relationship", color: "bg-teal-50 text-teal-800 border-teal-200" };
      case "attr":
        return { label: "Attribute", color: "bg-slate-100 text-slate-800 border-slate-300" };
      case "task":
        return { label: "BPMN Activity / Task", color: "bg-sky-50 text-sky-800 border-sky-200" };
      case "gw":
        return { label: "Exclusive XOR Gateway", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "start":
        return { label: "Start Event", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "end":
        return { label: "End Event", color: "bg-rose-50 text-rose-800 border-rose-200" };
      default:
        return { label: "Element", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  // Check if an edge is currently connected to active node
  const isEdgeConnected = (edge: DiagramEdge) => {
    return edge.f === activeNodeId || edge.t === activeNodeId;
  };

  return (
    <div className="w-full space-y-8" ref={containerRef}>
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white p-6 sm:p-10 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-navy-700/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive ER & BPMN</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            ER & BPMN: Bank Architecture & Workflows
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Examine how Indian retail banks manage accounts, branches, customers, and loans.
            Toggle between the formal relational database schema (ER Diagram) and the live business
            process for loan origination, verification, and disbursement (BPMN 2.0).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleOpenFullscreenHtml}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Open in Fullscreen Mode</span>
            </button>
            <button
              onClick={() => setShowSqlModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
            >
              <Code2 className="w-4 h-4 text-teal-400" />
              <span>View PostgreSQL DDL Schema</span>
            </button>
            <a
              href="/er-bpmn.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-slate-300 hover:text-white transition-colors underline underline-offset-4"
            >
              <span>Standalone HTML ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Canvas & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setTab("er");
                  setSelectedNodeId("loan");
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  tab === "er"
                    ? "bg-navy-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
                aria-selected={tab === "er"}
              >
                <Database className="w-4 h-4" />
                <span>ER Diagram</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("bp");
                  setSelectedNodeId("s");
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  tab === "bp"
                    ? "bg-navy-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
                aria-selected={tab === "bp"}
              >
                <GitBranch className="w-4 h-4" />
                <span>BPMN Process</span>
              </button>
            </div>

            {/* Path Selector (BPMN only) */}
            {tab === "bp" && (
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="token-path-select" className="text-slate-500 font-medium text-xs uppercase tracking-wider">
                  Token Path:
                </label>
                <select
                  id="token-path-select"
                  value={pathMode}
                  onChange={(e) => setPathMode(e.target.value as PathMode)}
                  className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ok">Loan Approved (Sanctioned)</option>
                  <option value="no">Loan Rejected (KYC / Credit Fail)</option>
                </select>
              </div>
            )}

            {/* Animation Controls: Speed & Replay */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <label htmlFor="anim-speed-select" className="text-slate-500 font-medium">
                  Speed:
                </label>
                <select
                  id="anim-speed-select"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={0.6}>0.6x (Slow)</option>
                  <option value={1}>1.0x (Normal)</option>
                  <option value={2.5}>2.5x (Fast)</option>
                  <option value={0}>Instant</option>
                </select>
              </div>

              <button
                type="button"
                onClick={runAnimation}
                disabled={isAnimating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                title="Replay drawing and simulation"
              >
                <RotateCcw className={cn("w-3.5 h-3.5", isAnimating && "animate-spin")} />
                <span>Replay</span>
              </button>

              <button
                type="button"
                onClick={handleOpenFullscreenHtml}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                title="Open standalone HTML file in Fullscreen Mode"
              >
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Canvas SVG Container */}
          <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-md p-4 sm:p-6 overflow-hidden">
            {/* Subtle Grid Background for ER */}
            {tab === "er" && (
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#cbd5e1 1.2px, transparent 1.2px)",
                  backgroundSize: "24px 24px",
                }}
              />
            )}

            <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
              {tab === "er" ? (
                /* ER SVG DIAGRAM */
                <svg
                  viewBox="0 0 780 560"
                  className="w-full min-w-[720px] h-auto select-none font-sans"
                  role="img"
                  aria-label="Entity Relationship diagram of Bank, Customer, Account, and Loan"
                >
                  <defs>
                    <marker
                      id="ah-er"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M0 0L10 5L0 10z" className="fill-slate-700" />
                    </marker>
                  </defs>

                  {/* EDGES */}
                  <g className="edges">
                    {ER_EDGES.map((edge) => {
                      const pts = getEdgePathPoints(edge, ER_NODES);
                      const isActive = activeEdgeIds.has(edge.id);
                      const isConnected = isEdgeConnected(edge);

                      if (edge.dbl) {
                        // Double line for total participation
                        const [[x1, y1], [x2, y2]] = pts;
                        const L = Math.hypot(x2 - x1, y2 - y1) || 1;
                        const dx = (-(y2 - y1) / L) * 3;
                        const dy = ((x2 - x1) / L) * 3;

                        return (
                          <g key={edge.id}>
                            <line
                              x1={x1 + dx}
                              y1={y1 + dy}
                              x2={x2 + dx}
                              y2={y2 + dy}
                              className={cn(
                                "transition-all duration-300",
                                isConnected
                                  ? "stroke-teal-600 stroke-[3.5px]"
                                  : isActive
                                  ? "stroke-slate-800 stroke-[2.2px]"
                                  : "stroke-slate-300 stroke-[1.8px]"
                              )}
                            />
                            <line
                              x1={x1 - dx}
                              y1={y1 - dy}
                              x2={x2 - dx}
                              y2={y2 - dy}
                              className={cn(
                                "transition-all duration-300",
                                isConnected
                                  ? "stroke-teal-600 stroke-[3.5px]"
                                  : isActive
                                  ? "stroke-slate-800 stroke-[2.2px]"
                                  : "stroke-slate-300 stroke-[1.8px]"
                              )}
                            />
                            {edge.lb && (
                              <text
                                x={edge.lb[0]}
                                y={edge.lb[1]}
                                className="fill-teal-700 font-bold text-xs"
                                dominantBaseline="central"
                                textAnchor="middle"
                              >
                                {edge.lb[2]}
                              </text>
                            )}
                          </g>
                        );
                      }

                      const dStr = "M " + pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");

                      return (
                        <g key={edge.id}>
                          <path
                            d={dStr}
                            fill="none"
                            markerEnd={edge.ar ? "url(#ah-er)" : undefined}
                            className={cn(
                              "transition-all duration-300",
                              isConnected
                                ? "stroke-teal-600 stroke-[3.5px]"
                                : isActive
                                ? "stroke-slate-700 stroke-[2px]"
                                : "stroke-slate-300 stroke-[1.5px]"
                            )}
                          />
                          {edge.lb && (
                            <text
                              x={edge.lb[0]}
                              y={edge.lb[1]}
                              className="fill-teal-700 font-bold text-xs"
                              dominantBaseline="central"
                              textAnchor="middle"
                            >
                              {edge.lb[2]}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* NODES */}
                  <g className="nodes">
                    {ER_NODES.map((n) => {
                      const isSelected = selectedNodeId === n.id;
                      const isHovered = hoveredNodeId === n.id;
                      const isHighlighted = isSelected || isHovered;
                      const isActivated = activeNodeIds.has(n.id);

                      return (
                        <g
                          key={n.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedNodeId(n.id)}
                          onMouseEnter={() => setHoveredNodeId(n.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                        >
                          {/* Shape Rendering based on node kind */}
                          {n.k === "ent" && (
                            <rect
                              x={n.x - (n.hw || 60)}
                              y={n.y - (n.hh || 22)}
                              width={(n.hw || 60) * 2}
                              height={(n.hh || 22) * 2}
                              rx={4}
                              className={cn(
                                "transition-all duration-300",
                                isHighlighted
                                  ? "fill-navy-950 stroke-teal-400 stroke-[3px] filter drop-shadow-md"
                                  : isActivated
                                  ? "fill-navy-900 stroke-navy-700 stroke-[2px]"
                                  : "fill-white stroke-slate-400 stroke-[1.8px]"
                              )}
                            />
                          )}

                          {n.k === "rel" && (
                            <polygon
                              points={`${n.x - (n.hw || 72)},${n.y} ${n.x},${n.y - (n.hh || 38)} ${
                                n.x + (n.hw || 72)
                              },${n.y} ${n.x},${n.y + (n.hh || 38)}`}
                              className={cn(
                                "transition-all duration-300",
                                isHighlighted
                                  ? "fill-teal-100 stroke-teal-600 stroke-[3px] filter drop-shadow-md"
                                  : isActivated
                                  ? "fill-teal-50 stroke-teal-500 stroke-[2px]"
                                  : "fill-white stroke-slate-400 stroke-[1.6px]"
                              )}
                            />
                          )}

                          {n.k === "attr" && (
                            <ellipse
                              cx={n.x}
                              cy={n.y}
                              rx={n.hw || 40}
                              ry={n.hh || 20}
                              className={cn(
                                "transition-all duration-300",
                                isHighlighted
                                  ? "fill-teal-50 stroke-teal-500 stroke-[2.5px] filter drop-shadow-sm"
                                  : isActivated
                                  ? "fill-white stroke-slate-600 stroke-[1.8px]"
                                  : "fill-white stroke-slate-300 stroke-[1.4px]"
                              )}
                            />
                          )}

                          {/* Node Text */}
                          {n.l.split("|").map((line, idx, arr) => (
                            <text
                              key={idx}
                              x={n.x}
                              y={n.y + (idx - (arr.length - 1) / 2) * 15}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={cn(
                                "text-[12px] font-semibold transition-colors pointer-events-none",
                                n.pk && "underline underline-offset-2",
                                n.k === "ent" && (isHighlighted || isActivated)
                                  ? "fill-white font-bold"
                                  : n.k === "rel"
                                  ? "fill-navy-950 font-medium"
                                  : "fill-slate-800"
                              )}
                            >
                              {line}
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              ) : (
                /* BPMN SVG DIAGRAM */
                <svg
                  viewBox="0 0 1000 430"
                  className="w-full min-w-[880px] h-auto select-none font-sans"
                  role="img"
                  aria-label="BPMN 2.0 loan origination workflow swimlane diagram"
                >
                  <defs>
                    <marker
                      id="ah-bp"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M0 0L10 5L0 10z" className="fill-slate-700" />
                    </marker>
                  </defs>

                  {/* SWIMLANES */}
                  <g className="swimlanes">
                    {BPMN_LANES.map((lane, i) => (
                      <g key={i}>
                        {/* Lane background */}
                        <rect
                          x={10}
                          y={lane.y}
                          width={980}
                          height={lane.height}
                          className="fill-slate-50/80 stroke-slate-200 stroke-[1.2px]"
                        />
                        {/* Lane Header */}
                        <rect
                          x={10}
                          y={lane.y}
                          width={38}
                          height={lane.height}
                          className="fill-navy-900 stroke-navy-800 stroke-[1.2px]"
                        />
                        {/* Vertical rotated lane title */}
                        <text
                          x={29}
                          y={lane.y + lane.height / 2}
                          className="fill-white font-bold text-xs uppercase tracking-wider"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(-90 29 ${lane.y + lane.height / 2})`}
                        >
                          {lane.title}
                        </text>
                      </g>
                    ))}
                  </g>

                  {/* BPMN FLOW EDGES */}
                  <g className="bpmn-edges">
                    {BPMN_EDGES.map((edge) => {
                      const pts = getEdgePathPoints(edge, BPMN_NODES);
                      const dStr = "M " + pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");
                      const isActive = activeEdgeIds.has(edge.id);
                      const isConnected = isEdgeConnected(edge);

                      return (
                        <g key={edge.id}>
                          <path
                            d={dStr}
                            fill="none"
                            markerEnd="url(#ah-bp)"
                            className={cn(
                              "transition-all duration-300",
                              isConnected
                                ? "stroke-teal-600 stroke-[3.5px]"
                                : isActive
                                ? "stroke-slate-800 stroke-[2.2px]"
                                : "stroke-slate-300 stroke-[1.6px]"
                            )}
                          />
                          {edge.lb && (
                            <text
                              x={edge.lb[0]}
                              y={edge.lb[1]}
                              className={cn(
                                "text-xs font-bold",
                                edge.lb[2] === "Yes" ? "fill-emerald-600" : "fill-rose-600"
                              )}
                              dominantBaseline="central"
                              textAnchor="middle"
                            >
                              {edge.lb[2]}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* ANIMATED PROCESS TOKEN */}
                  {tokenPos && (
                    <g className="token-glow pointer-events-none">
                      <circle
                        cx={tokenPos.x}
                        cy={tokenPos.y}
                        r={12}
                        className="fill-orange-400/30 animate-ping"
                      />
                      <circle
                        cx={tokenPos.x}
                        cy={tokenPos.y}
                        r={7}
                        className="fill-orange-500 stroke-white stroke-[2px] filter drop-shadow-md"
                      />
                    </g>
                  )}

                  {/* BPMN NODES */}
                  <g className="bpmn-nodes">
                    {BPMN_NODES.map((n) => {
                      const isSelected = selectedNodeId === n.id;
                      const isHovered = hoveredNodeId === n.id;
                      const isHighlighted = isSelected || isHovered;
                      const isActivated = activeNodeIds.has(n.id);

                      return (
                        <g
                          key={n.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedNodeId(n.id)}
                          onMouseEnter={() => setHoveredNodeId(n.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                        >
                          {/* Start Event: circle */}
                          {n.k === "start" && (
                            <circle
                              cx={n.x}
                              cy={n.y}
                              r={n.hw || 14}
                              className={cn(
                                "transition-all duration-300",
                                isHighlighted
                                  ? "fill-emerald-100 stroke-emerald-600 stroke-[3.5px] filter drop-shadow-md"
                                  : isActivated
                                  ? "fill-emerald-50 stroke-emerald-500 stroke-[2.5px]"
                                  : "fill-white stroke-emerald-400 stroke-[2px]"
                              )}
                            />
                          )}

                          {/* End Event: thick circle */}
                          {n.k === "end" && (
                            <circle
                              cx={n.x}
                              cy={n.y}
                              r={n.hw || 14}
                              className={cn(
                                "transition-all duration-300",
                                n.id === "e1"
                                  ? isHighlighted
                                    ? "fill-rose-100 stroke-rose-600 stroke-[5px] filter drop-shadow-md"
                                    : "fill-rose-50 stroke-rose-500 stroke-[4px]"
                                  : isHighlighted
                                  ? "fill-emerald-100 stroke-emerald-600 stroke-[5px] filter drop-shadow-md"
                                  : "fill-emerald-50 stroke-emerald-500 stroke-[4px]"
                              )}
                            />
                          )}

                          {/* Task: rounded rectangle */}
                          {n.k === "task" && (
                            <rect
                              x={n.x - (n.hw || 55)}
                              y={n.y - (n.hh || 27)}
                              width={(n.hw || 55) * 2}
                              height={(n.hh || 27) * 2}
                              rx={8}
                              className={cn(
                                "transition-all duration-300",
                                isHighlighted
                                  ? "fill-teal-50 stroke-teal-600 stroke-[3px] filter drop-shadow-md"
                                  : isActivated
                                  ? "fill-white stroke-slate-700 stroke-[2px]"
                                  : "fill-white stroke-slate-300 stroke-[1.6px]"
                              )}
                            />
                          )}

                          {/* Gateway: diamond with X cross */}
                          {n.k === "gw" && (
                            <g>
                              <polygon
                                points={`${n.x - (n.hw || 30)},${n.y} ${n.x},${n.y - (n.hh || 30)} ${
                                  n.x + (n.hw || 30)
                                },${n.y} ${n.x},${n.y + (n.hh || 30)}`}
                                className={cn(
                                  "transition-all duration-300",
                                  isHighlighted
                                    ? "fill-amber-100 stroke-amber-600 stroke-[3px] filter drop-shadow-md"
                                    : isActivated
                                    ? "fill-amber-50 stroke-amber-500 stroke-[2px]"
                                    : "fill-white stroke-slate-400 stroke-[1.6px]"
                                )}
                              />
                              <path
                                d={`M${n.x - 9} ${n.y - 9} L${n.x + 9} ${n.y + 9} M${n.x + 9} ${
                                  n.y - 9
                                } L${n.x - 9} ${n.y + 9}`}
                                className={cn(
                                  "stroke-[2.5px] transition-colors",
                                  isHighlighted ? "stroke-amber-700" : "stroke-slate-500"
                                )}
                              />
                            </g>
                          )}

                          {/* Label Rendering */}
                          {["start", "end", "gw"].includes(n.k) ? (
                            <text
                              x={n.x}
                              y={n.up ? n.y - 24 : n.y + (n.hh || 14) + 14}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={cn(
                                "text-[11px] font-bold fill-slate-800 transition-colors",
                                isHighlighted && "fill-teal-700"
                              )}
                            >
                              {n.l}
                            </text>
                          ) : (
                            n.l.split("|").map((line, idx, arr) => (
                              <text
                                key={idx}
                                x={n.x}
                                y={n.y + (idx - (arr.length - 1) / 2) * 14}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className={cn(
                                  "text-[11px] font-semibold fill-slate-800 pointer-events-none",
                                  isHighlighted && "fill-teal-800 font-bold"
                                )}
                              >
                                {line}
                              </text>
                            ))
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}
            </div>

            {/* Canvas Bottom Legend Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-4">
                {tab === "er" ? (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 h-2.5 rounded bg-navy-950 inline-block" /> Entity
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rotate-45 bg-teal-100 border border-teal-500 inline-block" /> Relationship
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 h-2 rounded-full border border-slate-500 inline-block" /> Attribute (<span className="underline">PK</span>)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 border-t-2 border-b-2 border-slate-800 h-1 inline-block" /> Total Participation
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-700" /> Many-to-One
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border-2 border-emerald-500 inline-block" /> Start Event
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 h-3 rounded bg-teal-50 border border-teal-500 inline-block" /> Activity / Task
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rotate-45 border border-amber-500 inline-block" /> XOR Gateway
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border-[3px] border-rose-500 inline-block" /> End Event
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Process Token
                    </span>
                  </>
                )}
              </div>

              <div className="text-slate-400 italic">
                Tip: Click or hover any shape to inspect its technical details.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Element Details Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                <span>Element Inspector</span>
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
                  getKindBadge(currentNode.k).color
                )}
              >
                {getKindBadge(currentNode.k).label}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-navy-950 flex items-center gap-2">
                  <span>{currentNode.l.split("|").join(" ")}</span>
                  {currentNode.pk && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Primary Key
                    </span>
                  )}
                </h3>
                {currentNode.of && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Belongs to entity: <strong className="text-navy-900">{currentNode.of}</strong>
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                {currentNode.info}
              </div>

              {/* Connected Relationships in diagram */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Connected Flows / Relationships
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentEdges
                    .filter((e) => e.f === currentNode.id || e.t === currentNode.id)
                    .map((edge) => {
                      const otherId = edge.f === currentNode.id ? edge.t : edge.f;
                      const otherNode = currentNodes.find((n) => n.id === otherId);
                      return (
                        <button
                          key={edge.id}
                          type="button"
                          onClick={() => setSelectedNodeId(otherId)}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-medium border border-teal-200/60 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{otherNode?.l.split("|").join(" ") || otherId}</span>
                          <ArrowRight className="w-3 h-3 text-teal-600" />
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* LoanLens Role Insight */}
              <div className="pt-3 border-t border-slate-100">
                <div className="rounded-xl bg-gradient-to-r from-teal-50 to-sky-50 p-3.5 border border-teal-100 text-xs text-slate-700 space-y-1.5">
                  <span className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-teal-600" />
                    <span>How LoanLens Connects Here</span>
                  </span>
                  <p className="leading-relaxed">
                    {tab === "er"
                      ? "LoanLens compares interest rates and tenure across bank branches, feeding verified data directly into the Loan and Branch models."
                      : currentNode.id === "g1" || currentNode.id === "t2"
                      ? "LoanLens's Loan Readiness Score helps applicants pre-verify FOIR and CIBIL score before reaching bank verification, minimizing gateway rejection."
                      : currentNode.id === "s" || currentNode.id === "t1"
                      ? "Users calculate their optimal EMI on LoanLens before initiating this start event, ensuring proper documentation upfront."
                      : "LoanLens models the complete bank origination lifecycle so borrowers understand why each document is requested."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relational Schema Table Section (Active for ER) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-950 flex items-center gap-2">
              <Database className="w-6 h-6 text-teal-600" />
              <span>Resulting 3NF Relational Schema</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Standard normalized database tables derived from this Entity-Relationship model.
              Underlined represents Primary Keys; italicized represents Foreign Keys.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <Code2 className="w-4 h-4 text-teal-600" />
            <span>PostgreSQL DDL</span>
          </button>
        </div>

        {/* 6 Relational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RELATIONAL_TABLES.map((table) => {
            const isEntitySelected =
              activeNodeId &&
              (activeNodeId.toLowerCase() === table.name.toLowerCase() ||
                (table.name === "Account" && activeNodeId === "acc") ||
                (table.name === "Branch" && activeNodeId === "br") ||
                (table.name === "Customer" && activeNodeId === "cus") ||
                (table.name === "Loan" && activeNodeId === "loan") ||
                (table.name === "Depositor" && activeNodeId === "dep") ||
                (table.name === "Borrower" && activeNodeId === "bor"));

            return (
              <div
                key={table.name}
                onClick={() => {
                  setTab("er");
                  if (table.name === "Account") setSelectedNodeId("acc");
                  else if (table.name === "Branch") setSelectedNodeId("br");
                  else if (table.name === "Customer") setSelectedNodeId("cus");
                  else if (table.name === "Loan") setSelectedNodeId("loan");
                  else if (table.name === "Depositor") setSelectedNodeId("dep");
                  else if (table.name === "Borrower") setSelectedNodeId("bor");
                }}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer",
                  isEntitySelected
                    ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md bg-teal-50/20"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm"
                )}
              >
                <div
                  className={cn(
                    "px-4 py-2.5 font-bold text-sm flex items-center justify-between",
                    isEntitySelected ? "bg-teal-700 text-white" : "bg-navy-950 text-white"
                  )}
                >
                  <span className="flex items-center gap-2 font-display">
                    <Database className="w-4 h-4 text-teal-400" />
                    {table.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded text-white">
                    Table
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1.5 font-mono text-xs">
                    {table.columns.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700">
                        <span className="flex items-center gap-1.5">
                          {col.isPk && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Primary Key" />
                          )}
                          <span
                            className={cn(
                              col.isPk && "underline font-bold text-navy-950",
                              col.isFk && "italic text-teal-700"
                            )}
                          >
                            {col.name}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">{col.type}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                    {table.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="underline font-bold text-navy-900">Underline</span>: Primary Key
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="italic text-teal-700 font-semibold">Italic</span>: Foreign Key (Reference)
          </div>
          <div className="text-slate-400 hidden sm:block">|</div>
          <div className="text-slate-500">
            Total participation of Account and Loan in Branch ensures referential integrity without orphan loans.
          </div>
        </div>
      </div>

      {/* Deep-Dive Architectural Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-navy-950">
            Core Banking System (CBS) Data Architecture
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            In modern Indian banking systems (such as Finacle or BaNCS used by SBI, ICICI, and HDFC),
            a customer entity is distinct from their account or loan obligations. The junction tables
            <code className="text-teal-700 font-semibold mx-1">Borrower</code> and
            <code className="text-teal-700 font-semibold mx-1">Depositor</code> enable multi-party
            co-borrowing, joint home loan applications, and institutional guarantees without duplicating
            records.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-bold text-navy-950">
            BPMN 2.0 Origination & SLA Automation
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The business process diagram demonstrates the 3 distinct swimlanes: borrower actions,
            underwriting branch staff validation, and automated core ledger systems.
            Loan origination systems (LOS) evaluate credit bureau records (CIBIL/Experian) at gateway
            <code className="text-amber-700 font-semibold mx-1">g1</code> to make instant sanction
            decisions before manual disbursement.
          </p>
        </div>
      </div>

      {/* SQL DDL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-teal-400" />
                <h3 className="font-display text-lg font-bold text-white">
                  PostgreSQL DDL (Relational Schema)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-semibold border border-teal-500/30 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-lg leading-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Code Body */}
            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-navy-950/90 leading-relaxed scrollbar-thin">
              <pre className="whitespace-pre">{SQL_DDL_SCRIPT}</pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-navy-900 flex items-center justify-between text-xs text-slate-400">
              <span>Ready for PostgreSQL 14+, MySQL 8+, and SQLite 3</span>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone HTML Fullscreen Viewer Modal */}
      {isFullscreenHtmlOpen && (
        <div
          ref={fullscreenContainerRef}
          className="fixed inset-0 z-50 bg-navy-950 flex flex-col w-screen h-screen overflow-hidden animate-fade-in"
        >
          {/* Top Bar for Fullscreen View */}
          <div className="bg-navy-950/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <div>
                <span className="font-display font-bold text-sm tracking-wide text-white block">
                  ER & BPMN: Fullscreen Standalone Model
                </span>
                <span className="text-[11px] text-slate-400">
                  Interactive HTML with dynamic line drawing and token simulator
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/er-bpmn.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-4 hidden sm:inline-flex items-center gap-1"
              >
                <span>Direct HTML Link ↗</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (!document.fullscreenElement) {
                    if (fullscreenContainerRef.current?.requestFullscreen) {
                      fullscreenContainerRef.current.requestFullscreen().catch(() => {});
                    } else if (document.documentElement.requestFullscreen) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    }
                  } else {
                    if (document.exitFullscreen) {
                      document.exitFullscreen().catch(() => {});
                    }
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Toggle Monitor Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Toggle Browser Fullscreen</span>
              </button>

              <button
                type="button"
                onClick={handleCloseFullscreenHtml}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              >
                <span>✕ Exit Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Standalone HTML Iframe taking full viewport */}
          <div className="flex-1 w-full h-full relative bg-slate-900">
            <iframe
              src="/er-bpmn.html"
              title="ER and BPMN Bank Model"
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>
      )}
    </div>
  );
}
