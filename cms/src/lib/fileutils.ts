export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();

  URL.revokeObjectURL(url); // Clean up
}

export function decodeBase64Utf8(base64Str: string) {
  const binary = atob(base64Str); // decode base64 to binary string
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0)); // convert binary to byte array
  return new TextDecoder("utf-8").decode(bytes); // decode UTF-8
}

export const trimBucketPrefix = (key: string) => {
  const prefix = "markdown/";
  const suffix = ".mdx";
  return key.replace(prefix, "").replace(suffix, "");
};
