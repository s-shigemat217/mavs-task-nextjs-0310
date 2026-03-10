import { Article } from "@/types/Article/Article";
import { requestJson } from "@/lib/api";

type ArticleInput = Pick<Article, "title" | "content">;

const buildHeaders = (token: string, includeJsonContentType = false) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const requestArticleApi = async <T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T | null> => {
  const response = await requestJson<T>(path, {
    ...init,
    headers: {
      ...buildHeaders(token),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.data;
};

export const fetchArticles = async (token: string): Promise<Article[]> => {
  const articles = await requestArticleApi<Article[]>("/articles", token);
  return Array.isArray(articles) ? articles : [];
};

export const fetchArticle = async (
  token: string,
  id: string | number,
): Promise<Article | null> => {
  const article = await requestArticleApi<Article>(`/articles/${id}`, token);
  return article?.id ? article : null;
};

export const createArticle = async (
  token: string,
  input: ArticleInput,
): Promise<Article | null> =>
  requestArticleApi<Article>("/articles", token, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(input),
  });

export const updateArticle = async (
  token: string,
  id: string | number,
  input: ArticleInput,
): Promise<Article | null> =>
  requestArticleApi<Article>(`/articles/${id}`, token, {
    method: "PUT",
    headers: buildHeaders(token, true),
    body: JSON.stringify(input),
  });

export const deleteArticle = async (
  token: string,
  id: string | number,
): Promise<boolean> => {
  const response = await requestJson<unknown>(`/articles/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  return response.ok;
};
