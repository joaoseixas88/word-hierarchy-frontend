import axios, { AxiosError, AxiosInstance } from "axios";

type HttpRequest<T> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  body?: T;
};

export class HttpClient {
  private client: AxiosInstance;
  private static instance: HttpClient;
  public static getInstance(): HttpClient {
    if (!this.instance) {
      this.instance = new HttpClient();
    }
    return this.instance;
  }

  protected constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
  }

  async post<T = any, R = any, E = any>(url: string, body: R) {
    return this.request<T, R, E>({ url, method: "POST", body });
  }

  async get<T = any, R = any, E = any>(url: string) {
    return this.request<T, R, E>({ url, method: "GET" });
  }

  async download<T = any, R = any, E = any>(
    url: string,
    fileName: string
  ): Promise<{ success: boolean; data: T; error?: E }> {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      const urlObject = URL.createObjectURL(blob);
      link.href = urlObject;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlObject);
      return {
        success: true,
        data: undefined as T,
        error: undefined,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          error: error.response?.data as E,
          success: false,
          data: undefined as T,
        };
      } else throw error;
    }
  }

  async request<T = any, R = any, E = any>({
    method,
    url,
    body,
  }: HttpRequest<R>): Promise<{ success: boolean; data: T; error?: E }> {
    try {
      const { data } = await this.client.request<T, any, R>({
        method,
        url,
        data: body,
      });
      return {
        data: data,
        success: true,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          error: error.response?.data as E,
          success: false,
          data: undefined as T,
        };
      } else throw error;
    }
  }
}

export const httpClient = HttpClient.getInstance();
