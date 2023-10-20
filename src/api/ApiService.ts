import { SAOL_BASE_API_URL } from '../Constants';

export class ApiService {
  constructor() {}

  async searchWord(searchTerm: string) {
    const searchParams = new URLSearchParams({
      sok: searchTerm,
    });

    const url = `${SAOL_BASE_API_URL}/sok?${searchParams}`;
    const res = await fetch(url);
    const data = await res.text();

    return this.parseHtml(data);
  }

  // TODO: Move to some utils folder?
  private parseHtml(text: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    console.log('Parsed HTML:', doc);

    return doc;
  }
}
