export class CustomTimer{
   timerStart(message: string) {
    const now = new Date();
    console.log(`🚀 Started: ${message} at ${now.toLocaleTimeString()}.${now.getMilliseconds()}ms`);
    return Date.now();
  }

  timerEnd(start: number, message: string) {
    const duration = Date.now() - start;
    console.log(`✅ Ended: ${message} - Duration: ${(duration / 1000).toFixed(3)} seconds`);
    return duration;
  }
}