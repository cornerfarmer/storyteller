
import {Word} from "./Word";
import {Vector} from "./Vector";

export class Phrase {
    public words : Array<Word>;
    private currentWordIndex: number;
    private areWordPositionsCalculated: boolean;

    constructor() {
        this.words = [];
        this.reset();
    }

    reset() {
        for (let word of this.words)
            word.reset();
        this.currentWordIndex = 0;
        this.areWordPositionsCalculated = false;
    }

    proceed(dt: number): boolean {
        return this.proceedCurrentWord(dt);
    }

    addWord(word: Word) {
        this.words.push(word);
    }

    private proceedCurrentWord(dt: number): boolean {
        let left = this.words[this.currentWordIndex].proceed(dt);

        if (left >= 0) {
            this.currentWordIndex++;
            if (left > 0 && this.currentWordIndex < this.words.length)
                this.proceedCurrentWord(left);
            return this.currentWordIndex >= this.words.length;
        } else
            return false;
    }

    write(context, position) {
        if (!this.areWordPositionsCalculated)
            this.calcWordPositions(context);

        for (let word of this.words)
            word.write(context, position);
    }

    calcWordPositions(context) {
        let pos = new Vector(0, 0);
        let nextI = 0;
        while (nextI < this.words.length)
            nextI = this.calcWordPositionsForLine(context, pos, nextI);

        this.areWordPositionsCalculated = true;
    }

    calcWordPositionsForLine(context, startPos: Vector, startId: number): number {
        let maxFontSize = 0;
        for (let i = startId; i < this.words.length; i++) {
            maxFontSize = Math.max(maxFontSize, this.words[i].font_size);
            if (this.words[i].newLineAfterwards)
                break;
        }

        let nextI;
        for (let i = startId; i < this.words.length; i++) {
            startPos.x = this.words[i].calcPosition(
                context,
                startPos,
                maxFontSize,
                startId !== i && this.words[i - 1].font_size < this.words[i].font_size,
                i + 1 < this.words.length && !this.words[i].newLineAfterwards && this.words[i + 1].font_size <= this.words[i].font_size
            ).x;
            if (this.words[i].newLineAfterwards) {
                nextI = i + 1;
                break;
            }
        }

        startPos.x = 0;
        startPos.y += maxFontSize + 10;
        return nextI;
    }

    recalculatePositions() {
        this.areWordPositionsCalculated = false;
    }

    getTotalText() {
        let text = "";
        for (let word of this.words)
            text += word.text + " ";
        return text;
    }

    getTotalTime(): number {
        let time = 0;
        for (let word of this.words)
            time += word.getTotalTime();
        return time;
    }
}