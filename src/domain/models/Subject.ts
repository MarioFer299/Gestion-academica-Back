export interface Subject {
  id: string;
  name: string;
  description?: string;
  academicPeriodId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}