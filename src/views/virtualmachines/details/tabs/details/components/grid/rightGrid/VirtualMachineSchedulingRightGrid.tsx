import * as React from 'react';

import VirtualMachineModel from '@kubevirt-ui/kubevirt-api/console/models/VirtualMachineModel';
import { V1VirtualMachine } from '@kubevirt-ui/kubevirt-api/kubevirt';
import CPUMemoryModal from '@kubevirt-utils/components/CPUMemoryModal/CpuMemoryModal';
import { useModal } from '@kubevirt-utils/components/ModalProvider/ModalProvider';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { DescriptionList, GridItem } from '@patternfly/react-core';

import DedicatedResources from '../../DedicatedResources/DedicatedResources';
import DedicatedResourcesModal from '../../DedicatedResources/DedicatedResourcesModal';
import EvictionStrategy from '../../EvictionStrategy/EvictionStrategy';
import EvictionStrategyModal from '../../EvictionStrategy/EvictionStrategyModal';
import Flavor from '../../Flavor/Flavor';
import VirtualMachineDescriptionItem from '../../VirtualMachineDescriptionItem/VirtualMachineDescriptionItem';

type VirtualMachineSchedulingLeftGridProps = {
  vm?: V1VirtualMachine;
};

const VirtualMachineSchedulingLeftGrid: React.FC<VirtualMachineSchedulingLeftGridProps> = ({
  vm,
}) => {
  const { t } = useKubevirtTranslation();
  const { createModal } = useModal();

  const onSubmit = React.useCallback(
    (updatedVM: V1VirtualMachine) =>
      k8sUpdate({
        model: VirtualMachineModel,
        data: updatedVM,
        ns: updatedVM?.metadata?.namespace,
        name: updatedVM?.metadata?.name,
      }),
    [],
  );

  return (
    <GridItem span={5}>
      <DescriptionList>
        <VirtualMachineDescriptionItem
          descriptionData={<Flavor vm={vm} />}
          descriptionHeader={t('CPU | Memory')}
          isEdit
          onEditClick={() =>
            createModal(({ isOpen, onClose }) => (
              <CPUMemoryModal vm={vm} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
            ))
          }
        />
        <VirtualMachineDescriptionItem
          descriptionData={<DedicatedResources vm={vm} />}
          descriptionHeader={t('Dedicated Resources')}
          isEdit
          onEditClick={() =>
            createModal(({ isOpen, onClose }) => (
              <DedicatedResourcesModal
                vm={vm}
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                headerText={t('Dedicated Resources')}
              />
            ))
          }
        />
        <VirtualMachineDescriptionItem
          descriptionData={<EvictionStrategy vm={vm} />}
          descriptionHeader={t('Eviction Strategy')}
          isEdit
          onEditClick={() =>
            createModal(({ isOpen, onClose }) => (
              <EvictionStrategyModal
                vm={vm}
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                headerText={t('Eviction Strategy')}
              />
            ))
          }
        />
      </DescriptionList>
    </GridItem>
  );
};

export default VirtualMachineSchedulingLeftGrid;
