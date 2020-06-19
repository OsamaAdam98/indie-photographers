interface Photo {
  public_id?: string;
  version?: string;
  width?: number;
  height?: number;
  format?: string;
  created_at?: Date;
  resource_type?: string;
  tags?: [];
  bytes?: number;
  type?: string;
  etag?: string;
  url?: string;
  eager?: [
    {
      transformation?: string;
      width?: number;
      height?: number;
      bytes?: number;
      url?: string;
      secure_url?: string;
    }
  ];
  secure_url?: string;
  signature?: string;
  original_filename?: string;
}
