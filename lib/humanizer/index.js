class Humanizer{
  static async sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)) }
  static async mimicScrolling(){
    const maximalScroll = Math.floor((Math.random() * 50) + 10)
    for(let numberOfScroll = 0; numberOfScroll < maximalScroll; numberOfScroll++){
      const scrollRange = Math.floor((Math.random() * 500) + 100);
      const scrollDirection = Math.floor((Math.random() * 2 ) + 1) === 1? 1: -1;
      const sleepDuration = Math.floor((Math.random() * 500) + 100);
      window.scrollBy(0, scrollRange * scrollDirection);
      await Humanizer.sleep(sleepDuration);
    }
  }
}
module.exports = Humanizer;