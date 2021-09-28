export function createAnimationClassNames(
  name: string,
  styles: {
    readonly [key: string]: string;
  }
) {
  return {
    enter: styles[`${name}Enter`],
    enterActive: styles[`${name}EnterActive`],
    enterDone: styles[`${name}EnterDone`],
    exit: styles[`${name}Exit`],
    exitActive: styles[`${name}ExitActive`],
    exitDone: styles[`${name}ExitDone`],
  };
}
