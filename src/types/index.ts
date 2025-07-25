// Alias para claridad en fechas
export type ISODate = string;       
export type ISODateTime = string;   

// Enums como union types
export type RoomStatus = 'available' | 'occupied' | 'maintenance';
export type OccupationStatus = 'active' | 'completed' | 'canceled';
export type DocumentType = 'DNI' | 'CE' | 'PASSPORT';

// Room (habitaciones)
export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  price_per_night: number;
  description?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// Tenant (inquilinos)
export interface Tenant {
  id: string;
  name: string;
  document_type: DocumentType | string; 
  document_number: string;
  phone?: string;
  email?: string;
  emergency_contact?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// Occupation (ocupaciones/reservas)
export interface Occupation {
  id: string;
  room_id: string;
  tenant_id: string;
  check_in_date: ISODate;
  check_out_date?: ISODate;
  planned_check_out: ISODate;
  price_per_night: number;
  total_amount: number;
  status: OccupationStatus;
  notes?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;

  // Relaciones opcionales 
  room?: Room;
  tenant?: Tenant;
}

// DashboardStats (para KPIs del dashboard)
export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  totalTenants: number;
  activeOccupations: number;
  monthlyRevenue: number;
}
