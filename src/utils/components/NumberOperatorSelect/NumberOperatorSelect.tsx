import React, { FC, useMemo } from 'react';

import { NumberOperator } from '@kubevirt-utils/utils/constants';
import { SimpleSelect, SimpleSelectOption } from '@patternfly/react-templates';

import { numberOperatorSelectOptions } from './constants';

type NumberOperatorSelectProps = {
  onSelect: (value: NumberOperator) => void;
  selected: NumberOperator;
};

const NumberOperatorSelect: FC<NumberOperatorSelectProps> = ({ onSelect, selected }) => {
  const initialOptions = useMemo<SimpleSelectOption[]>(
    () =>
      numberOperatorSelectOptions.map((option) => ({
        ...option,
        selected: option.value === selected,
      })),
    [selected],
  );

  return (
    <SimpleSelect
      initialOptions={initialOptions}
      onSelect={(_, selection: NumberOperator) => onSelect(selection)}
    />
  );
};

export default NumberOperatorSelect;
