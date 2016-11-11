
export interface TimedEvent{
    startTime: number
}

export interface IntervalViewerEventListener {
    eventEntered: (e: TimedEvent) => any;
    eventExit: (e: TimedEvent) => any;
}


export class IntervalViewer {
    events: TimedEvent[];
    eventListener: IntervalViewerEventListener;
    currentStartIndex: number;
    currentEndIndex: number;

    constructor(intervals: TimedEvent[], eventListener: IntervalViewerEventListener) {
        this.events = intervals;

        this.currentEndIndex = 0;
        this.currentStartIndex = 0;
        this.eventListener = eventListener;
    }

    findIndexOfFirstAfter(time: number): number{
        let i = this.currentStartIndex;
        const numIntervals = this.events.length;
        while (i < numIntervals){
            const interval = this.events[i];

            if(interval.startTime > time){
                return i;
            }
        }
        return -1;
    }

    findIndexOfLastBefore(time: number): number{
        let i = this.currentEndIndex;
        const numIntervals = this.events.length;
        while (i < numIntervals){
            const interval = this.events[i];

            if( interval.startTime > time) {
                return Math.max(i - 1, 0);
            }
        }
    }

    seekForwardIncremental(time: number, window: number){//optimized for linear, incremental movement
        let newStartIndex = this.findIndexOfFirstAfter(time);
        let newEndIndex = this.findIndexOfLastBefore(time + window);
        //
        //for(var i = this.currentStartIndex; i < newStartIndex; i++){
        //    this.eventListener.eventExit()
        //
        //}

    }




}