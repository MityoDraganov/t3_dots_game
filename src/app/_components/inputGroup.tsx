import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const InputGroup = ({
  label,
  placeHolder,
  value,
  onChange,
  id,
  type,
  className,
  multiple,
}: {
  label: string;
  placeHolder: string | undefined;
  value?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //id: keyof IUser | keyof ProductMutableData | keyof IMarketplaceSettingsDto;
  id: string;
  type?: string;
  className?: string;
  multiple?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        className={`${!value ? "bg-muted" : ""} ${className} text-slate-900`}
        id={id}
        type={type || "text"}
        multiple
      />
    </div>
  );
};