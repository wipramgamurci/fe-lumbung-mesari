/**
 * Client-only: triggers a file download for a Blob (object URL + temporary anchor).
 */
export function triggerBlobDownload(blob: Blob, fileName: string): void {
  if (typeof window === "undefined") {
    throw new Error("triggerBlobDownload must run in the browser");
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);

  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
  }
}

/**
 * Extracts a human-readable message from a failed blob $fetch (API may return JSON in a Blob body).
 */
export async function parseBlobDownloadErrorMessage(
  err: unknown,
  fallbackMessage: string,
): Promise<string> {
  const e = err as {
    message?: string;
    data?: unknown;
  };
  let errorMessage = e?.message || fallbackMessage;

  if (e?.data instanceof Blob) {
    try {
      const text = await e.data.text();
      const errorJson = JSON.parse(text) as { message?: string };
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // keep errorMessage
    }
  } else if (
    e?.data &&
    typeof e.data === "object" &&
    e.data !== null &&
    "message" in e.data
  ) {
    errorMessage =
      String((e.data as { message: string }).message) || errorMessage;
  }

  return errorMessage;
}

export type DownloadBlobReportOptions = {
  query?: Record<string, string | number | boolean | null | undefined>;
  fileName: string;
  /** Used when the error body cannot be parsed */
  fallbackErrorMessage: string;
  onSuccess?: () => void;
};

/**
 * GET a blob from a URL (e.g. report proxy) and trigger download. Throws Error with a parsed message on failure.
 */
export async function downloadBlobReport(
  url: string,
  options: DownloadBlobReportOptions,
): Promise<void> {
  try {
    const blob = await $fetch<Blob>(url, {
      method: "GET",
      query: options.query,
      responseType: "blob",
    });
    triggerBlobDownload(blob, options.fileName);
    options.onSuccess?.();
  } catch (err) {
    const message = await parseBlobDownloadErrorMessage(
      err,
      options.fallbackErrorMessage,
    );
    throw new Error(message);
  }
}
