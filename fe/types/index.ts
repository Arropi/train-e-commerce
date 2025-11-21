import { inventories } from './../../be/node_modules/.prisma/client/index.d';
export type Profile = {
    email: string,
    password?: string
    username?: string
}

const dataLab = [{
    'id': 1,
    'name': 'Elektronika'
}, {
    'id': 2,
    'name': 'IDK'
}]

export interface Inventory {
  id: number
  item_name: string
  no_item: string
  condition: "good" | "bad"
  alat_bhp: string
  type: string
  no_inv_ugm: string | null
  information: string | null
  special_session: boolean
  room_id: number | null
  labolatory_id: number
  created_by: number
  updated_by: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  inventory_subjects: InventorySubject[]
  inventory_galleries: InventoryGallery[]
  status: string
}

export interface InventorySubject {
  id: number
  inventory_id: number
  subject_id: number
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface InventoryGallery {
  id: number
  inventory_id: number
  filepath: string
  filename: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export type Laboratory = {
    id: number,
    title: string,
    iconPath: string
}

export type Subject = {
    id: number,
    subject_name: string
}

export type Rooms = {
    id: number;
    name: string;
}

export interface Inventory {
  id: number;
  item_name: string;
  no_item: string;
  condition: "good" | "bad"
  type: "praktikum" | "projek" | string;
  special_session: boolean;
  room_id: number | null;
  laboratory_id: number | null;
  img_url: string | null;
  subject_id: number[];
}
export interface Reserve {
  id: number;
  pic: string;
  status: "waiting_to_be_return" | "done" | "process" | "canceled" | "approved" | "rejected"; 
  tanggal: string; // ISO date string
  session_id: number;
  inventories_id: number;
  user_id: number;
  subject_id: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  inventories: Inventory;
}

export interface TimeSession { 
  id: number;
  special_session: boolean;
  start: string;
  end: string;
}

export interface InventoryCart {
  id: number;
  inventories_id: number;
  session_id: number;
  user_id: number;
  tanggal: Date
  created_at: string | null;
  updated_at: string | null;
  inventories: Inventory;
}

export interface InventoryReserves {
  id: number;
  pic: string | null;
  tanggal: Date
  status: "process" | "waiting_to_be_return" | "approve" | "canceled" | "rejected" | "done"
  session_id: number;
  inventories_id: number;
  subject_id: number | null;
  updated_by: number
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null
  inventories: Inventory
}