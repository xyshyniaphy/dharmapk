export interface Node {
  id: string | null;
  text: string | null;
  children: Node[];
  attributes: any;
}
