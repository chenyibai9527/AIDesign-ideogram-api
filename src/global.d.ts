interface Window {
  gtag: (
    key: string,
    trackingId: string,
    config: { page_path: string }
  ) => void;
}
