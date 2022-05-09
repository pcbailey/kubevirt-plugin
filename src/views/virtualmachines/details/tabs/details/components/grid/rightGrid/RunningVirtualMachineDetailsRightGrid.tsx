import * as React from 'react';

import { V1VirtualMachine } from '@kubevirt-ui/kubevirt-api/kubevirt';
import useSSHService from '@kubevirt-utils/components/SSHAccess/useSSHService';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { useVMIAndPodsForVM } from '@kubevirt-utils/resources/vm/hooks';
import { useGuestOS } from '@kubevirt-utils/resources/vmi/hooks';

import { getRunningVMRightGridPresentation } from '../../../utils/gridHelper';

import VirtualMachineDetailsRightGridLayout from './VirtualMachineDetailsRightGridLayout';

type VirtualMachineDetailsRightGridProps = {
  vm?: V1VirtualMachine;
};

const RunningVirtualMachineDetailsRightGrid: React.FC<VirtualMachineDetailsRightGridProps> = ({
  vm,
}) => {
  const { t } = useKubevirtTranslation();
  const { vmi, pods } = useVMIAndPodsForVM(vm?.metadata?.name, vm?.metadata?.namespace);
  const [guestAgentData] = useGuestOS(vmi);
  const watchSSHService = useSSHService(vmi);

  return (
    <VirtualMachineDetailsRightGridLayout
      vm={vm}
      vmDetailsRightGridObj={getRunningVMRightGridPresentation(
        t,
        vmi,
        pods,
        guestAgentData,
        watchSSHService,
      )}
      sshService={watchSSHService[0]}
      vmi={vmi}
    />
  );
};

export default RunningVirtualMachineDetailsRightGrid;
