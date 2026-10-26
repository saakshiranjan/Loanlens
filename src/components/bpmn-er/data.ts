export interface DiagramNode {
  id: string;
  k: "ent" | "rel" | "attr" | "task" | "gw" | "start" | "end";
  l: string;
  x: number;
  y: number;
  info: string;
  pk?: boolean;
  up?: boolean;
  hw?: number;
  hh?: number;
  of?: string;
}

export interface DiagramEdge {
  id: string;
  f: string;
  t: string;
  p?: [number, number][];
  dbl?: boolean;
  ar?: boolean;
  lb?: [number, number, string];
  fl?: boolean;
}

export interface RelationalTable {
  name: string;
  columns: { name: string; isPk?: boolean; isFk?: boolean; type: string }[];
  description: string;
}

export const NODE_DIMENSIONS: Record<string, [number, number]> = {
  ent: [60, 22],
  rel: [72, 38],
  gw: [30, 30],
  task: [55, 27],
  start: [14, 14],
  end: [14, 14],
};

export const ER_NODES: DiagramNode[] = [
  {
    id: "acc",
    k: "ent",
    l: "Account",
    x: 150,
    y: 170,
    info: "Key Ac_no. Total participation in Account branch (double line): every account belongs to exactly one branch, so b_name is folded in. Table: Account(Ac_no, Balance, b_name).",
    hw: 60,
    hh: 22,
  },
  {
    id: "br",
    k: "ent",
    l: "Branch",
    x: 600,
    y: 170,
    info: "Key b_name. The 'one' side of Account branch and Loan branch. Table: Branch(b_name, b_city, Assets).",
    hw: 60,
    hh: 22,
  },
  {
    id: "cus",
    k: "ent",
    l: "Customer",
    x: 150,
    y: 400,
    info: "Key C_name. Reaches accounts through Depositor and loans through Borrower, both many-to-many. Table: Customer(C_name, C_city, C_street).",
    hw: 60,
    hh: 22,
  },
  {
    id: "loan",
    k: "ent",
    l: "Loan",
    x: 600,
    y: 400,
    info: "Key L_no. Total participation in Loan branch, so b_name is folded in. Table: Loan(L_no, Amt, b_name).",
    hw: 60,
    hh: 22,
  },
  {
    id: "accbr",
    k: "rel",
    l: "Account|branch",
    x: 375,
    y: 170,
    info: "Many-to-one: many accounts, one branch. The arrow points at the 'one' side. No table of its own because Account has total participation.",
    hw: 72,
    hh: 38,
  },
  {
    id: "locbr",
    k: "rel",
    l: "Loan|branch",
    x: 600,
    y: 285,
    info: "Many-to-one: many loans, one branch. Loan has total participation, so the relationship merges into the Loan table.",
    hw: 72,
    hh: 38,
  },
  {
    id: "dep",
    k: "rel",
    l: "Depositor",
    x: 150,
    y: 285,
    info: "Many-to-many between Customer and Account. Becomes a table: Depositor(C_name, Ac_no).",
    hw: 72,
    hh: 38,
  },
  {
    id: "bor",
    k: "rel",
    l: "Borrower",
    x: 375,
    y: 400,
    info: "Many-to-many between Customer and Loan. Becomes a table: Borrower(C_name, L_no).",
    hw: 72,
    hh: 38,
  },
  {
    id: "acno",
    k: "attr",
    l: "Ac_no",
    x: 80,
    y: 62,
    of: "Account",
    pk: true,
    info: "Primary key (underlined) of Account. Unique account identifier.",
    hw: 42,
    hh: 20,
  },
  {
    id: "bal",
    k: "attr",
    l: "Balance",
    x: 215,
    y: 62,
    of: "Account",
    info: "Attribute of Account. Current liquid balance in INR.",
    hw: 50,
    hh: 20,
  },
  {
    id: "bname",
    k: "attr",
    l: "b_name",
    x: 505,
    y: 62,
    of: "Branch",
    pk: true,
    info: "Primary key (underlined) of Branch. Bank branch code/name.",
    hw: 48,
    hh: 20,
  },
  {
    id: "bcity",
    k: "attr",
    l: "b_city",
    x: 610,
    y: 38,
    of: "Branch",
    info: "Attribute of Branch. City location of the bank branch.",
    hw: 44,
    hh: 20,
  },
  {
    id: "assets",
    k: "attr",
    l: "Assets",
    x: 710,
    y: 62,
    of: "Branch",
    info: "Attribute of Branch. Total monetary assets held by this branch.",
    hw: 46,
    hh: 20,
  },
  {
    id: "ccity",
    k: "attr",
    l: "C_city",
    x: 55,
    y: 495,
    of: "Customer",
    info: "Attribute of Customer. City of residence.",
    hw: 44,
    hh: 20,
  },
  {
    id: "cname",
    k: "attr",
    l: "C_name",
    x: 150,
    y: 520,
    of: "Customer",
    pk: true,
    info: "Primary key (underlined) of Customer. Full legal customer name.",
    hw: 50,
    hh: 20,
  },
  {
    id: "cstreet",
    k: "attr",
    l: "C_street",
    x: 250,
    y: 495,
    of: "Customer",
    info: "Attribute of Customer. Residential street address.",
    hw: 52,
    hh: 20,
  },
  {
    id: "lno",
    k: "attr",
    l: "L_no",
    x: 540,
    y: 495,
    of: "Loan",
    pk: true,
    info: "Primary key (underlined) of Loan. Unique loan reference identifier.",
    hw: 40,
    hh: 20,
  },
  {
    id: "amt",
    k: "attr",
    l: "Amt",
    x: 665,
    y: 495,
    of: "Loan",
    info: "Attribute of Loan. Total principal sanctioned amount in INR.",
    hw: 40,
    hh: 20,
  },
];

export const ER_EDGES: DiagramEdge[] = [
  { id: "a1", f: "acc", t: "acno" },
  { id: "a2", f: "acc", t: "bal" },
  { id: "r1", f: "acc", t: "accbr", dbl: true, lb: [240, 156, "N"] },
  { id: "r2", f: "accbr", t: "br", p: [[447, 170], [540, 170]], ar: true, lb: [512, 156, "1"] },
  { id: "a3", f: "br", t: "bname" },
  { id: "a4", f: "br", t: "bcity" },
  { id: "a5", f: "br", t: "assets" },
  { id: "r3", f: "acc", t: "dep", lb: [165, 218, "M"] },
  { id: "r4", f: "dep", t: "cus", lb: [165, 358, "N"] },
  { id: "a6", f: "cus", t: "cname" },
  { id: "a7", f: "cus", t: "ccity" },
  { id: "a8", f: "cus", t: "cstreet" },
  { id: "r5", f: "cus", t: "bor", lb: [236, 388, "M"] },
  { id: "r6", f: "bor", t: "loan", lb: [512, 388, "N"] },
  { id: "a9", f: "loan", t: "lno" },
  { id: "a10", f: "loan", t: "amt" },
  { id: "r7", f: "loan", t: "locbr", dbl: true, lb: [617, 362, "N"] },
  { id: "r8", f: "locbr", t: "br", p: [[600, 247], [600, 192]], ar: true, lb: [617, 218, "1"] },
];

export const BPMN_LANES = [
  { title: "Customer", y: 20, height: 130 },
  { title: "Branch staff", y: 150, height: 130 },
  { title: "Bank system", y: 280, height: 130 },
];

export const BPMN_NODES: DiagramNode[] = [
  {
    id: "s",
    k: "start",
    l: "Needs a loan",
    x: 90,
    y: 85,
    info: "Start event: a customer decides to apply for a loan after researching rates or calculating EMI.",
    hw: 14,
    hh: 14,
  },
  {
    id: "t1",
    k: "task",
    l: "Submit loan|application",
    x: 210,
    y: 85,
    info: "The customer sends the application along with identity, address, and income documents.",
    hw: 55,
    hh: 27,
  },
  {
    id: "t2",
    k: "task",
    l: "Verify customer|& documents",
    x: 350,
    y: 215,
    info: "Branch staff check Customer records (C_name, C_city, C_street), PAN/Aadhaar KYC, and pay slips.",
    hw: 55,
    hh: 27,
  },
  {
    id: "g1",
    k: "gw",
    l: "Eligible?",
    x: 490,
    y: 215,
    info: "Exclusive XOR Gateway: exactly one path is chosen. If credit score, FOIR, and documents qualify, leads to approval; otherwise rejection.",
    hw: 30,
    hh: 30,
  },
  {
    id: "e1",
    k: "end",
    l: "Rejection sent",
    x: 490,
    y: 85,
    info: "End event: the customer is formally notified of loan rejection with adverse action reasons.",
    up: true,
    hw: 14,
    hh: 14,
  },
  {
    id: "t3",
    k: "task",
    l: "Approve loan &|assign branch",
    x: 630,
    y: 215,
    info: "Branch manager approves sanctioned terms and ties the loan to a servicing Branch (b_name foreign key).",
    hw: 55,
    hh: 27,
  },
  {
    id: "t4",
    k: "task",
    l: "Create Loan &|Borrower records",
    x: 630,
    y: 345,
    info: "Core Banking System (CBS) inserts new rows into Loan(L_no, Amt, b_name) and Borrower(C_name, L_no).",
    hw: 55,
    hh: 27,
  },
  {
    id: "t5",
    k: "task",
    l: "Update branch|assets",
    x: 780,
    y: 345,
    info: "Core banking automates general ledger updates, increasing branch loan assets in Branch.Assets.",
    hw: 55,
    hh: 27,
  },
  {
    id: "t6",
    k: "task",
    l: "Disburse loan",
    x: 780,
    y: 215,
    info: "Branch operations release the funds (Amt) via RTGS/NEFT to the customer's operative account.",
    hw: 55,
    hh: 27,
  },
  {
    id: "t7",
    k: "task",
    l: "Receive funds",
    x: 780,
    y: 85,
    info: "The customer receives confirmation of credited loan funds and the initial EMI repayment schedule.",
    hw: 55,
    hh: 27,
  },
  {
    id: "e2",
    k: "end",
    l: "Loan active",
    x: 910,
    y: 85,
    info: "End event: the loan account is fully active and serviced through monthly EMI collections.",
    hw: 14,
    hh: 14,
  },
];

export const BPMN_EDGES: DiagramEdge[] = [
  { id: "f1", f: "s", t: "t1", p: [[104, 85], [155, 85]], ar: true },
  { id: "f2", f: "t1", t: "t2", p: [[210, 112], [210, 215], [295, 215]], ar: true },
  { id: "f3", f: "t2", t: "g1", p: [[405, 215], [460, 215]], ar: true },
  { id: "f4", f: "g1", t: "e1", p: [[490, 185], [490, 99]], ar: true, lb: [506, 150, "No"], fl: true },
  { id: "f5", f: "g1", t: "t3", p: [[520, 215], [575, 215]], ar: true, lb: [548, 202, "Yes"], fl: true },
  { id: "f6", f: "t3", t: "t4", p: [[630, 242], [630, 318]], ar: true },
  { id: "f7", f: "t4", t: "t5", p: [[685, 345], [725, 345]], ar: true },
  { id: "f8", f: "t5", t: "t6", p: [[780, 318], [780, 242]], ar: true },
  { id: "f9", f: "t6", t: "t7", p: [[780, 188], [780, 112]], ar: true },
  { id: "f10", f: "t7", t: "e2", p: [[835, 85], [896, 85]], ar: true },
];

export const BPMN_PATHS = {
  ok: ["f1", "f2", "f3", "f5", "f6", "f7", "f8", "f9", "f10"],
  no: ["f1", "f2", "f3", "f4"],
};

export const RELATIONAL_TABLES: RelationalTable[] = [
  {
    name: "Account",
    columns: [
      { name: "Ac_no", isPk: true, type: "VARCHAR(20)" },
      { name: "Balance", type: "DECIMAL(15,2)" },
      { name: "b_name", isFk: true, type: "VARCHAR(50)" },
    ],
    description: "Every account belongs to exactly one branch (total participation), so b_name is migrated in.",
  },
  {
    name: "Branch",
    columns: [
      { name: "b_name", isPk: true, type: "VARCHAR(50)" },
      { name: "b_city", type: "VARCHAR(50)" },
      { name: "Assets", type: "DECIMAL(18,2)" },
    ],
    description: "Core branch servicing unit holding aggregate sanctioned assets and physical location.",
  },
  {
    name: "Loan",
    columns: [
      { name: "L_no", isPk: true, type: "VARCHAR(20)" },
      { name: "Amt", type: "DECIMAL(15,2)" },
      { name: "b_name", isFk: true, type: "VARCHAR(50)" },
    ],
    description: "Total participation in Loan-Branch means each loan is issued and booked under a specific branch.",
  },
  {
    name: "Customer",
    columns: [
      { name: "C_name", isPk: true, type: "VARCHAR(100)" },
      { name: "C_city", type: "VARCHAR(50)" },
      { name: "C_street", type: "VARCHAR(100)" },
    ],
    description: "Individual borrower or depositor identity with verified KYC location details.",
  },
  {
    name: "Depositor",
    columns: [
      { name: "C_name", isPk: true, isFk: true, type: "VARCHAR(100)" },
      { name: "Ac_no", isPk: true, isFk: true, type: "VARCHAR(20)" },
    ],
    description: "Many-to-many relationship resolving which customers have ownership or signing rights on accounts.",
  },
  {
    name: "Borrower",
    columns: [
      { name: "C_name", isPk: true, isFk: true, type: "VARCHAR(100)" },
      { name: "L_no", isPk: true, isFk: true, type: "VARCHAR(20)" },
    ],
    description: "Many-to-many relationship linking legal borrowers (including co-applicants) to loan obligations.",
  },
];

export const SQL_DDL_SCRIPT = `-- =================================================================
-- Indian Banking Sector Core Relational Schema (PostgreSQL)
-- Entity-Relationship Design translated to 3NF Relational Tables
-- =================================================================

-- 1. Branch Table
CREATE TABLE branch (
    b_name VARCHAR(50) PRIMARY KEY,
    b_city VARCHAR(50) NOT NULL,
    assets NUMERIC(18, 2) NOT NULL DEFAULT 0.00 CHECK (assets >= 0)
);

-- 2. Customer Table
CREATE TABLE customer (
    c_name VARCHAR(100) PRIMARY KEY,
    c_city VARCHAR(50) NOT NULL,
    c_street VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Account Table (Total participation with Branch: b_name is NOT NULL)
CREATE TABLE account (
    ac_no VARCHAR(20) PRIMARY KEY,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    b_name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_account_branch FOREIGN KEY (b_name)
        REFERENCES branch(b_name) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4. Loan Table (Total participation with Branch: b_name is NOT NULL)
CREATE TABLE loan (
    l_no VARCHAR(20) PRIMARY KEY,
    amt NUMERIC(15, 2) NOT NULL CHECK (amt > 0),
    b_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'CLOSED', 'DEFAULTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loan_branch FOREIGN KEY (b_name)
        REFERENCES branch(b_name) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 5. Depositor Junction Table (M:N between Customer and Account)
CREATE TABLE depositor (
    c_name VARCHAR(100) NOT NULL,
    ac_no VARCHAR(20) NOT NULL,
    PRIMARY KEY (c_name, ac_no),
    CONSTRAINT fk_depositor_customer FOREIGN KEY (c_name)
        REFERENCES customer(c_name) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_depositor_account FOREIGN KEY (ac_no)
        REFERENCES account(ac_no) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 6. Borrower Junction Table (M:N between Customer and Loan)
CREATE TABLE borrower (
    c_name VARCHAR(100) NOT NULL,
    l_no VARCHAR(20) NOT NULL,
    is_primary_applicant BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (c_name, l_no),
    CONSTRAINT fk_borrower_customer FOREIGN KEY (c_name)
        REFERENCES customer(c_name) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_borrower_loan FOREIGN KEY (l_no)
        REFERENCES loan(l_no) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Indexes for optimal relational query performance
CREATE INDEX idx_account_branch ON account(b_name);
CREATE INDEX idx_loan_branch ON loan(b_name);
CREATE INDEX idx_depositor_account ON depositor(ac_no);
CREATE INDEX idx_borrower_loan ON borrower(l_no);
`;
