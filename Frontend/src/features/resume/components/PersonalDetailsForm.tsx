import { useEffect, useMemo, useRef, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema, type UpsertPersonalDetailsRequestDto } from "../api/dto";
import { useResumeStore } from "../hooks/useResumeStore";
import { useCurrentStudentQuery } from "@/features/auth/api/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface PersonalDetailsFormProps {
  resumeSqid: string;
}

const normalizeOptionalText = (value?: string | null) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const emptyValues: UpsertPersonalDetailsRequestDto = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  provinceState: "",
  country: "",
  postalCode: "",
  linkedInUrl: "",
  portfolioUrl: "",
};

const toPersonalDetailsPayload = (values: UpsertPersonalDetailsRequestDto): UpsertPersonalDetailsRequestDto => ({
  firstName: values.firstName?.trim() ?? "",
  lastName: values.lastName?.trim() ?? "",
  middleName: normalizeOptionalText(values.middleName),
  email: values.email?.trim() ?? "",
  phoneNumber: values.phoneNumber?.trim() ?? "",
  addressLine1: values.addressLine1?.trim() ?? "",
  addressLine2: normalizeOptionalText(values.addressLine2),
  city: values.city?.trim() ?? "",
  provinceState: values.provinceState?.trim() ?? "",
  country: values.country?.trim() ?? "",
  postalCode: values.postalCode?.trim() ?? "",
  linkedInUrl: normalizeOptionalText(values.linkedInUrl),
  portfolioUrl: normalizeOptionalText(values.portfolioUrl),
});

const PersonalDetailsForm = ({ resumeSqid }: PersonalDetailsFormProps) => {
  const { data: student, isLoading: isLoadingStudent } = useCurrentStudentQuery();
  const initialData = useResumeStore((state) => state.data.personalDetails);
  const updateStore = useResumeStore((state) => state.updatePersonalDetails);
  
  const lastPushedToStoreRef = useRef<string | null>(null);

  const defaultValues = useMemo(() => {
    return {
      ...emptyValues,
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      email: student?.email ?? "",
      phoneNumber: student?.phoneNumber ?? "",
      ...(initialData || {}),
    };
  }, [initialData, student]);

  const { register, watch, reset, getValues } = useForm<UpsertPersonalDetailsRequestDto>({
    resolver: zodResolver(personalDetailsSchema) as any,
    defaultValues,
  });

  // Only reset if initialData changed from an external source
  useEffect(() => {
    const currentStoreSignature = JSON.stringify(initialData || {});
    if (currentStoreSignature !== lastPushedToStoreRef.current) {
      reset(defaultValues);
      lastPushedToStoreRef.current = currentStoreSignature;
    }
  }, [defaultValues, reset, initialData]);

  const formData = watch();
  const previewFormData = useDebounce(formData, 150);
  useDebounce(formData, 900);

  useEffect(() => {
    const signature = JSON.stringify(previewFormData);
    if (signature !== lastPushedToStoreRef.current) {
      lastPushedToStoreRef.current = signature;
      updateStore(previewFormData as any);
    }
  }, [previewFormData, updateStore]);

  useEffect(() => {
    const values = getValues();
    updateStore(toPersonalDetailsPayload(values) as any);
  }, [resumeSqid, getValues, updateStore]);

  if (isLoadingStudent) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#00CEC8]" />
      </div>
    );
  }

  const fieldClassName = "bg-[#161616] border-white/10 text-white placeholder:text-white/45 focus:border-[#00CEC8]/60 focus:ring-[#00CEC8]/15 transition-all";

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/50 italic">Changes here are applied to the editor instantly and saved with the main resume save flow.</p>
      </div>

      <div className="grid grid-cols-1 @[450px]:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">First Name</Label>
          <Input id="firstName" {...register("firstName")} className={fieldClassName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Last Name</Label>
          <Input id="lastName" {...register("lastName")} className={fieldClassName} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="middleName" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Middle Name</Label>
        <Input id="middleName" {...register("middleName")} className={fieldClassName} />
      </div>

      <div className="grid grid-cols-1 @[450px]:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Email</Label>
          <Input id="email" type="email" {...register("email")} className={fieldClassName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Phone</Label>
          <Input id="phoneNumber" {...register("phoneNumber")} className={fieldClassName} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Address Line 1</Label>
        <Input id="addressLine1" {...register("addressLine1")} className={fieldClassName} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Address Line 2</Label>
        <Input id="addressLine2" {...register("addressLine2")} className={fieldClassName} />
      </div>

      <div className="grid grid-cols-1 @[450px]:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">City</Label>
          <Input id="city" {...register("city")} className={fieldClassName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provinceState" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">State/Province</Label>
          <Input id="provinceState" {...register("provinceState")} className={fieldClassName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Postal Code</Label>
          <Input id="postalCode" {...register("postalCode")} className={fieldClassName} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Country</Label>
        <Input id="country" {...register("country")} className={fieldClassName} />
      </div>

      <div className="grid grid-cols-1 @[450px]:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedInUrl" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">LinkedIn URL</Label>
          <Input
            id="linkedInUrl"
            {...register("linkedInUrl")}
            className={fieldClassName}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl" className="text-white/85 text-[11px] font-bold uppercase tracking-wider">Portfolio URL</Label>
          <Input
            id="portfolioUrl"
            {...register("portfolioUrl")}
            className={fieldClassName}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(PersonalDetailsForm);
