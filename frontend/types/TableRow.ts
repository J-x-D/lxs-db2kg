export interface TableRow {
  id?: number;
  prof_id?: number;
  course_name?: string;
  prof_name?: string;
  actions?: string | number | boolean | undefined | JSX.Element;
  [key: string]: string | number | boolean | undefined | JSX.Element;
}
