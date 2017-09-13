export abstract class AbstractTransition {

    proceed(dt : number): boolean {
        return this.internProceed(dt);
    }

    protected abstract internProceed(dt: number): boolean;
}