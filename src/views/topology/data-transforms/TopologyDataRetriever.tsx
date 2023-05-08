import React from 'react';
import * as _ from 'lodash';

import { useK8sWatchResources } from '@console/internal/components/hooks/k8s-watch-hook';
import { useDebounceCallback } from '@console/shared';
import { WatchK8sResources, WatchK8sResults } from '@openshift-console/dynamic-plugin-sdk';
import { observer } from '@patternfly/react-topology';

import { TopologyResourcesObject, TrafficData } from '../utils/types/topology-types';

import { ExtensibleModel, ModelContext } from './ModelContext';
import { updateTopologyDataModel } from './updateTopologyDataModel';
import { useMonitoringAlerts } from './useMonitoringAlerts';

type TopologyDataRetrieverProps = {
  trafficData?: TrafficData;
};

const TopologyDataRetriever: React.FC<TopologyDataRetrieverProps> = ({ trafficData }) => {
  const dataModelContext = React.useContext<ExtensibleModel>(ModelContext);
  const { namespace, extensionsLoaded, watchedResources } = dataModelContext;
  const [resources, setResources] = React.useState<WatchK8sResults<TopologyResourcesObject>>();
  const monitoringAlerts = useMonitoringAlerts(namespace);
  const resourcesList = React.useMemo<WatchK8sResources<any>>(
    () => (namespace && extensionsLoaded ? watchedResources : {}),
    [extensionsLoaded, watchedResources, namespace],
  );

  const debouncedUpdateResources = useDebounceCallback(setResources, 250);

  const updatedResources = useK8sWatchResources<TopologyResourcesObject>(resourcesList);
  React.useEffect(
    () => debouncedUpdateResources(updatedResources),
    [debouncedUpdateResources, updatedResources],
  );

  // Wipe the current model on a namespace change
  React.useEffect(() => {
    dataModelContext.model = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace]);

  React.useEffect(() => {
    if (!_.isEmpty(resources)) {
      updateTopologyDataModel(dataModelContext, resources, trafficData, monitoringAlerts)
        .then((res) => {
          dataModelContext.loadError = res.loadError;
          if (res.loaded) {
            dataModelContext.loaded = true;
            dataModelContext.model = res.model;
          }
        })
        .catch(() => {});
    }
  }, [resources, trafficData, dataModelContext, monitoringAlerts]);

  return null;
};

export default observer(TopologyDataRetriever);
