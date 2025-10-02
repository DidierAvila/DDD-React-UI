export interface Service {
  id: string;
  consultantId: string;
  consultantName: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ServiceDetail {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  methodology: string;
  isActive: boolean;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
}

export interface UpdateServiceRequest {
  id: string;
  name: string;
  description: string;
  price: number;
}
