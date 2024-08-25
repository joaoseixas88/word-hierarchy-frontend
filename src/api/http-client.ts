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

  async get<T = any, R = any, E = any>(url: string) {
    return this.request<T, R, E>({ url, method: "GET" });
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
