export function generateRequestId(type: 'skin' | 'chat'): string {
  // Generate ID in format skin-[timestamp] or chat-[timestamp]
  const timestamp = Date.now();
  return `${type}-${timestamp}`;
}
