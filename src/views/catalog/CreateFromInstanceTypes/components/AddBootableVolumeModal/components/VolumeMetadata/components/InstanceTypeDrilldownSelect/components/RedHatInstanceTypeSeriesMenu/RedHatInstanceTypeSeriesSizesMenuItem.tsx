import React, { Dispatch, FC, SetStateAction } from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { readableSizeUnit } from '@kubevirt-utils/utils/units';
import { MenuItem } from '@patternfly/react-core';

import { InstanceTypeSize } from '../../utils/types';

type RedHatInstanceTypeSeriesSizesMenuItemProps = {
  seriesName: string;
  sizes: InstanceTypeSize[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
};

const RedHatInstanceTypeSeriesSizesMenuItems: FC<RedHatInstanceTypeSeriesSizesMenuItemProps> = ({
  seriesName,
  sizes,
  selected,
  setSelected,
}) => {
  const { t } = useKubevirtTranslation();

  return (
    <>
      {sizes.map(({ sizeLabel, cpus, memory }) => {
        const itName = `${seriesName}.${sizeLabel}`;
        return (
          <MenuItem
            key={itName}
            itemId={itName}
            onClick={() => setSelected(itName)}
            isSelected={selected === itName}
            description={t('{{cpus}} CPUs, {{memory}} Memory', {
              cpus,
              memory: readableSizeUnit(memory),
            })}
          >
            {sizeLabel}
          </MenuItem>
        );
      })}
    </>
  );
};

export default RedHatInstanceTypeSeriesSizesMenuItems;
