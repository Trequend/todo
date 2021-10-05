export function getFileUrl(id: string) {
  return `${process.env.REACT_APP_API_URL}/uploads/${id}`;
}
