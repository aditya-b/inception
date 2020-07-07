import _ from "lodash";
import { PrometheusDataProcessor } from "./DataProcessor";
import { alertManager } from "../../ui";

type Status = 'error' | 'success';
const API_ENDPOINT = 'http://localhost:9090/api/v1';


interface PrometheusRequestResult {
    status: Status;
    data: any;
    errorType?: string;
    error?: string;
    warnings?: string[];
}

interface PrometheusQueryResult {
    status: Status;
    error: boolean;
    data: any;
    errors: string[]; 
}

export interface PrometheusQuery {
    query: string;
    range: {
        from: number;
        to: number;
    };
    step: number;
}

export class PrometheusQueryProcessor{
    dataProcessor: PrometheusDataProcessor;
    labelData: Record<string,string[]>;
    metrics: string[];
    inFlightRequests: any[];

    constructor() {
        this.dataProcessor = new PrometheusDataProcessor();
        this.labelData = {};
        this.metrics = [];
        this.inFlightRequests = [];
    }

    initMetrics() {
        const url = `${API_ENDPOINT}/label/__name__/values`;
        return fetch(url)
        .then(res => res.json())
        .then((res:PrometheusRequestResult) => {
            const { status, data, error='' } = res;
            if (status === 'success') {
                this.metrics.push(..._.sortBy(data));
            } else {
                console.log(error)
            }
        })
        .catch(error => {
            console.log(error);
            alertManager.alert(error.message, "error");
        })
    }

    getMetrics() {
        if (_.isEmpty(this.metrics)) {
            return this.initMetrics().then(() => this.metrics);
        }
        return Promise.resolve(this.metrics);
    }

    query(request: PrometheusQuery): Promise<PrometheusQueryResult> {
        const { query, range, step } = request;
        const result: PrometheusQueryResult = {
            status: "success",
            error: false,
            data: {},
            errors: []
        }
        if (query) {
            const queryParams = {
                query,
                start: range.from,
                end: range.to,
                step
            };
            const queryStr = _.join(_.map(queryParams, (v,k) => `${k}=${v}`), '&');
            const url = `${API_ENDPOINT}/query_range?${queryStr}`;
            return fetch(url)
            .then(res => res.json())
            .then((res: PrometheusRequestResult) => {
                const { status, data, error='' } = res;
                if (status === 'success' && !_.isEmpty(data.result)) {
                    result.data = _.map(data.result, d => this.dataProcessor.processMatrixData(d));
                } else {
                    const err = _.isEmpty(data.result) ? `No data found for query ${query}` : error;
                    result.status = "error";
                    result.errors.push(err);
                    result.error = true;
                }
                return result;
            })
            .catch(error => {
                console.log(error);
                result.status = "error";
                result.errors.push(error.message);
                result.error = true;
                alertManager.alert(error.message, "error");
                return result;
            })
        } else {
            result.status = "error";
            result.error = true;
            result.errors.push('Invalid query');
            return Promise.resolve(result);
        }
    }
}