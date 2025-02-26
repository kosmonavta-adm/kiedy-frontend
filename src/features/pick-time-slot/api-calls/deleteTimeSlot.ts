export async function deleteTimeSlotMutation(timeSlotToDelete: { userId: string; time: number }): Promise<boolean> {
  const response = await fetch(`${import.meta.env.VITE_API}/chosenSlots`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(timeSlotToDelete),
  });
  if (response.ok) {
    return true;
  }

  return false;
}
