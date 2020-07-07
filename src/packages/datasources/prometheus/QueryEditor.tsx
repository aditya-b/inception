import React, { Component } from "react";
import { PrometheusQueryProcessor } from "./QueryProcessor";
import { Autocomplete, TextInput } from "evergreen-ui";
import moment from "moment";
import { join } from "lodash";
import { alertManager } from "../../ui";

interface Props {
    onDataUpdate: (data: any) => any;
    query: string;
}

export class QueryEditor extends Component<Props>{
    queryProcessor: PrometheusQueryProcessor;
    metrics: string[];

    state: {
        query: string;
        start: any;
        end: any;
        isReady: boolean;
    }

    constructor(props: Props) {
        super(props);
        this.queryProcessor = new PrometheusQueryProcessor();
        this.state = {
            query: props.query || '',
            isReady: false,
            end: moment(),
            start: moment().clone().subtract(6, 'h')
        }
    }

    componentDidMount() {
        this.initSuggestions();
    }

    initSuggestions() {
        this.queryProcessor.getMetrics()
        .then(metrics => {
            this.metrics = metrics;
            this.setState({ isReady: true });
        });
    }

    queryUpdated = (query: string) => {
        this.setState({ query });
    }

    runQuery = () => {
        const { query, start, end } = this.state;
        const from = start.unix();
        const to = end.unix();
        this.queryProcessor.query({
            query,
            range: {
                from, to
            },
            step: 15
        })
        .then(result => {
            const { error, errors, data } = result;
            if (error) {
                alertManager.alert(join(errors, ','), 'error');  
            } else {
                this.props.onDataUpdate(data);
            }
        })
    }

    render() {
        const { query, isReady } = this.state;
        return <div className="prom-query-editor">
            { isReady && 
                <Autocomplete
                    title="Metrics"
                    onChange={this.queryUpdated}
                    items={this.metrics}
                    selectedItem={query}
                    inputValue={query}
                    >
                    {(props: any) => {
                        const { getInputProps, getRef, inputValue, openMenu, closeMenu  } = props
                        return (
                        <TextInput
                            placeholder="Query"
                            value={inputValue}
                            innerRef={getRef}
                            {...getInputProps({
                            onFocus: () => {
                                openMenu();
                            },
                            onChange: (evt: any) => this.queryUpdated(evt.target.value),
                            onBlur: () => { 
                                closeMenu();
                                setTimeout(() => this.runQuery());
                            }
                            })}
                        />
                        )
                    }}
                </Autocomplete>
            }
            { !isReady &&
                'Loading metrics...'
            }
        </div>
    }
}