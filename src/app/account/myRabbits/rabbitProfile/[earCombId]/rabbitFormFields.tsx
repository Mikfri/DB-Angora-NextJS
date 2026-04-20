// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitFormFields.tsx
'use client';
import { ReactNode, useState, useEffect, useRef } from "react";
import { Input, Switch } from '@/components/ui/heroui';
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from "@/api/types/AngoraDTOs";
import EnumAutocomplete from "@/components/ui/custom/autocomplete/EnumAutocomplete";
import { validateParentReference } from "@/app/actions/rabbit/rabbitCrudActions";
import { FaCheckCircle, FaInfoCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

// Eksporter konstanten, så den kan bruges andre steder
export const editableFieldLabels: Record<keyof Rabbit_UpdateDTO, string> = {
  nickName: "Navn",
  race: "Race",
  color: "Farve",
  dateOfBirth: "Fødselsdato",
  dateOfDeath: "Dødsdato",
  gender: "Køn",
  isForBreeding: "Til avl",  // Rettet fra forBreeding til isForBreeding
  fatherId_Placeholder: "Far ID",
  motherId_Placeholder: "Mor ID"
};

function getTypingHint(val: string): { text: string; color: string } {
  if (!val) return { text: 'Format: XXXX-XXXX (f.eks. 5000-1234)', color: 'text-foreground/50' };
  if (!val.includes('-')) return { text: 'Tilføj bindestreg mellem ørenumrene', color: 'text-warning' };
  const parts = val.split('-');
  if (parts.length > 2) return { text: 'Kun ét bindestreg er tilladt', color: 'text-danger' };
  const [left, right] = parts;
  if ((left + right).length < 4) return { text: 'Fortsæt med at skrive ID\'et...', color: 'text-foreground/50' };
  return { text: 'Tab ud af feltet for at verificere i systemet', color: 'text-foreground/50' };
}

function ParentIdInput({
  fieldKey,
  value,
  onChange,
  isChanged,
}: {
  fieldKey: 'fatherId_Placeholder' | 'motherId_Placeholder';
  value: string;
  onChange: (val: string) => void;
  isChanged?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid' | 'notfound'>('idle');
  const [validationHint, setValidationHint] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const isFocusedRef = useRef(false);
  const gender = fieldKey === 'fatherId_Placeholder' ? 'Han' : 'Hun';

  // Auto-validate when value changes while NOT focused (mount + after cancel)
  useEffect(() => {
    if (isFocusedRef.current) return;
    if (value && value.includes('-')) {
      setStatus('loading');
      setValidationHint('');
      validateParentReference(value, gender).then(res => {
        if (isFocusedRef.current) return;
        if (!res.success) {
          setStatus(res.isNotFound ? 'notfound' : 'invalid');
          setValidationHint(res.message);
        } else if (res.result?.isValidParent) {
          setStatus('valid');
          setValidationHint(res.message ?? 'Registreret i systemet');
        } else {
          setStatus('invalid');
          setValidationHint(res.message ?? 'Ikke egnet som forælder');
        }
      });
    } else {
      setStatus('idle');
      setValidationHint('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    isFocusedRef.current = true;
  };

  const handleBlur = async () => {
    setIsFocused(false);
    isFocusedRef.current = false;
    if (!value || !value.includes('-')) {
      setStatus('idle');
      setValidationHint('');
      return;
    }
    setStatus('loading');
    setValidationHint('');
    const res = await validateParentReference(value, gender);
    if (!res.success) {
      setStatus(res.isNotFound ? 'notfound' : 'invalid');
      setValidationHint(res.message);
    } else if (res.result?.isValidParent) {
      setStatus('valid');
      setValidationHint(res.message ?? 'Registreret i systemet');
    } else {
      setStatus('invalid');
      setValidationHint(res.message ?? 'Ikke egnet som forælder');
    }
  };

  const typingHint = isFocused ? getTypingHint(value) : null;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9a-zA-Z-]/g, ''))}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0000-1111"
          className={`transition-colors duration-200${isChanged ? ' border-amber-400' : ''}`}
          aria-label={fieldKey === 'fatherId_Placeholder' ? 'Far ID' : 'Mor ID'}
        />
        {!isFocused && status === 'loading' && <FaSpinner className="animate-spin text-foreground/50 shrink-0" />}
        {!isFocused && status === 'valid' && <FaCheckCircle className="text-success shrink-0" />}
        {!isFocused && status === 'invalid' && <FaTimesCircle className="text-danger shrink-0" />}
        {!isFocused && status === 'notfound' && <FaInfoCircle className="text-warning shrink-0" />}
      </div>
      {typingHint && (
        <p className={`text-xs ${typingHint.color}`}>{typingHint.text}</p>
      )}
      {!isFocused && validationHint && (
        <p className={`text-xs ${status === 'valid' ? 'text-success' : status === 'notfound' ? 'text-warning' : 'text-danger'}`}>{validationHint}</p>
      )}
    </div>
  );
}

export function renderEditNode(
  key: keyof Rabbit_UpdateDTO,
  editedData: Rabbit_ProfileDTO,
  setEditedData: (data: Rabbit_ProfileDTO) => void,
  isChanged?: boolean
): ReactNode {
  const className = `transition-colors duration-200${isChanged ? ' border-amber-400' : ''}`;
  // Enum inputs (moved to top since it's more specific)
  if (key === "race" || key === "color" || key === "gender") {
    const enumType = key === "race" ? "Race" : key === "color" ? "Color" : "Gender";
    return (
      <EnumAutocomplete
        id={`${key}-input`}
        enumType={enumType}
        value={editedData[key]}
        onChange={(newVal) => setEditedData({ ...editedData, [key]: newVal })}
        label={editableFieldLabels[key]}
        aria-labelledby={`${key}-label`}
        placeholder={`Vælg ${editableFieldLabels[key].toLowerCase()}`}
      />
    );
  }

  if (key === "isForBreeding") {
    // Brug typeguard til at håndtere forskellige typer
    let isSelected = false;
    
    // Konverter til boolean uanset input type
    if (typeof editedData[key] === 'boolean') {
      isSelected = editedData[key] as boolean;
    } else if (typeof editedData[key] === 'string') {
      isSelected = (editedData[key] as string) === "true" || (editedData[key] as string) === "Ja";
    }
    
    return (
      <Switch
        id={`${key}-input`}
        size="md"
        isSelected={isSelected}
        onChange={(checked) =>
          setEditedData({ ...editedData, [key]: checked })
        }
        className={className}
        aria-label={editableFieldLabels[key]}
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <span className="text-sm">{isSelected ? 'Ja' : 'Nej'}</span>
      </Switch>
    );
  }

  // Date inputs
  if (key === "dateOfBirth" || key === "dateOfDeath") {
    // Format the date value for the input
    let dateValue = '';
    if (editedData[key]) {
      const date = new Date(editedData[key] as string);
      dateValue = date.toISOString().split('T')[0]; // Gets YYYY-MM-DD format
    }

    return (
      <Input
        id={`${key}-input`}
        type="date"
        value={dateValue}
        onChange={(e) => {
          // When a new date is selected, format it consistently
          const newDate = e.target.value
            ? new Date(e.target.value).toISOString().split('T')[0]  // Convert to YYYY-MM-DD
            : null;
          setEditedData({ ...editedData, [key]: newDate });
        }}
        className={className}
        aria-label={editableFieldLabels[key]}
      />
    );
  }

  // Parent ID inputs
  if (key === "fatherId_Placeholder" || key === "motherId_Placeholder") {
    return (
      <ParentIdInput
        fieldKey={key}
        value={(editedData[key] as string) || ''}
        onChange={(val) => setEditedData({ ...editedData, [key]: val })}
        isChanged={isChanged}
      />
    );
  }

  // Text input (default case)
  return (
    <Input
      id={`${key}-input`}

      value={editedData[key]?.toString() || ""}
      onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
      className={className}
      aria-label={editableFieldLabels[key]}
    />
  );
}
