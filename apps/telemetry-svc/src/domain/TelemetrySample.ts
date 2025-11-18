export class TelemetrySample {
  readonly deviceId: string;
  readonly timestamp: Date;
  readonly metricType: string;
  readonly valueNumber?: number;
  readonly valueText?: string;

  constructor(params: {
    deviceId: string;
    timestamp: Date;
    metricType: string;
    valueNumber?: number;
    valueText?: string;
  }) {
    this.deviceId = params.deviceId;
    this.timestamp = params.timestamp;
    this.metricType = params.metricType;
    this.valueNumber = params.valueNumber;
    this.valueText = params.valueText;
  }
}


