export interface AcademicPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}