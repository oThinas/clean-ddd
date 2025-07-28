export class Slug {
  value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    return new Slug(value);
  }

  /**
   * Receives a string and returns a slugified version of it.
   *
   * @param text {string}
   * @example
   * "Hello World!" => "hello-world"
   */
  static createFromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/, '');

    return new Slug(slug);
  }
}
