export class MinioVariablesProvider {
  /**
   * URL do servidor MinIO
   */
  public readonly endpoint: string;

  /**
   * Porta do servidor MinIO
   */
  public readonly port: number;

  /**
   * Nome do usuário para acesso ao MinIO
   */
  public readonly accessKey: string;

  /**
   * Senha do usuário para acesso ao MinIO
   */
  public readonly secretKey: string;

  /**
   * Nome do bucket padrão para imagens
   */
  public readonly imagesBucket: string;

  /**
   * URL base para acesso às imagens
   */
  public readonly baseUrl: string;

  /**
   * Indica se deve usar SSL
   */
  public readonly useSSL: boolean;

  public constructor(
    endpoint: string,
    port: string,
    accessKey: string,
    secretKey: string,
    imagesBucket: string,
    baseUrl: string,
    useSSL: string = 'false',
  ) {
    this.endpoint = endpoint;
    this.port = parseInt(port, 10);
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.imagesBucket = imagesBucket;
    this.baseUrl = baseUrl;
    this.useSSL = useSSL === 'true';
  }
}
