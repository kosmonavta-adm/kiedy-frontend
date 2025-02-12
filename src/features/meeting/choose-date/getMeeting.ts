export function getMeeting(id: number) {
  return {
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/meeting/${id}`);
      return await response.json();
    },
    queryKey: ['meeting', id],
  };
}
