export interface TableAction<T = unknown> {
  key: string;
  label: string;
  handler: (item: T) => void;
  class: string;
  condition?: (item: T) => boolean;
}
