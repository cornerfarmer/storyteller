
import {Word} from "./Word";
import {Vector} from "./Vector";

export class Phrase {
    private words : Array<Word>;
    private currentWordIndex: number;
    private areWordPositionsCalculated: boolean;

    constructor() {
        this.words = [];
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

    write(context) {
        if (!this.areWordPositionsCalculated)
            this.calcWordPositions(context);

        for (let word of this.words)
            word.write(context, new Vector(200, 100));
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
            startPos.x = this.words[i].calcPosition(context, startPos, maxFontSize).x;
            if (this.words[i].newLineAfterwards) {
                nextI = i + 1;
                break;
            }
        }

        startPos.x = 0;
        startPos.y += maxFontSize;
        return nextI;
    }
}