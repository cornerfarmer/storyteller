
import {Word} from "./Word";

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
        var left = this.words[this.currentWordIndex].proceed(dt);

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
            word.write(context, 10);
    }

    calcWordPositions(context) {
        let x = 0;
        for (let word of this.words)
            x = word.calcPosition(context, x);
        this.areWordPositionsCalculated = true;
    }
}