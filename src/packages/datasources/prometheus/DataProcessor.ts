import _ from 'lodash';

const METRIC_TAG = '__name__';

export interface PrometheusRawMatrixResult {
    metric: Record<string,string>;
    values: [number, string][];
}

export interface PrometheusRawVectorResult {
    metric: any;
    values: [number, string];
}

export interface PrometheusMatrixResult {
    tags: Record<string,string>;
    metric: string;
    values: [number, number][];
}

export class PrometheusDataProcessor {
    processMatrixData(rawData: PrometheusRawMatrixResult): PrometheusMatrixResult {
        const { metric: tagData, values: rawValues } = rawData;
        const metric = tagData[METRIC_TAG];
        const tags = _.omit(tagData, [METRIC_TAG]);
        const values: [number,number][] = _.map(rawValues, val => {
            const ts = val[0] * 1000;
            const value = _.parseInt(val[1]);
            return [ts, value];
        });
        return {
            metric,
            tags,
            values
        }
    }
}