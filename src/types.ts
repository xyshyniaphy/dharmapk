export interface Node {
  id: string;
  text: string;
  children?: Node[];
  attributes?: { [key: string]: any };
}
