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
  id: number;
  item_name: string;
  no_item: string;
  condition: "good" | "bad" | "maintenance";
  type: "praktikum" | "projek" | string;
  special_session: boolean;
  room_id: number | null;
  laboratory_id: number | null;
  img_url: string | null;
  subject_id: number[];
}