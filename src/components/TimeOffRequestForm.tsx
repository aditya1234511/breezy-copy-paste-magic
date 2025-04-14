
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LeaveBalanceCard from './LeaveBalanceCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Define the validation schema
const formSchema = z.object({
  employeeName: z.string().min(1, { message: "Employee name is required" }),
  employeeCode: z.string().min(1, { message: "Employee code is required" }),
  profile: z.string().min(1, { message: "Profile is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  numberOfDays: z.string().min(1, { message: "Number of days is required" }),
  reason: z.string().min(1, { message: "Reason is required" }),
  leaveType: z.string().min(1, { message: "Leave type is required" }),
  fromDate: z.date({ required_error: "From date is required" }),
  toDate: z.date({ required_error: "To date is required" }),
  dayPortion: z.enum(['firstHalf', 'secondHalf']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const leaveTypes = [
  { 
    id: 'SL', 
    name: 'Sick Leave', 
    color: 'sickLeave',
    stats: { allowed: '01', available: '11', taken: '01' }
  },
  { 
    id: 'LWP', 
    name: 'Leave Without Pay', 
    color: 'leaveWithoutPay',
    stats: { allowed: '-', available: '04', taken: '02' }
  },
  { 
    id: 'EL', 
    name: 'Earned Leave', 
    color: 'earnedLeave',
    stats: { allowed: '01', available: '07', taken: '03' }
  },
  { 
    id: 'ML', 
    name: 'Maternity Leave', 
    color: 'maternityLeave',
    stats: { allowed: '01', available: '19', taken: '00' }
  },
  { 
    id: 'HD', 
    name: 'Half Day Leave', 
    color: 'halfDayLeave',
    stats: { allowed: '01', available: '60', taken: '13' }
  },
];

const TimeOffRequestForm = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: '',
      employeeCode: '',
      profile: '',
      department: '',
      numberOfDays: '02',
      reason: 'Not Well',
      leaveType: 'SL',
      fromDate: new Date(),
      toDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      dayPortion: undefined,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Request submitted",
      description: "Your time-off request has been submitted successfully."
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8 border-b pb-4">
        TIME-OFF REQUEST
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Employee Name" {...field} className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Employee Code" {...field} className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Profile" {...field} className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Department" {...field} className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {leaveTypes.map((leaveType) => (
              <LeaveBalanceCard
                key={leaveType.id}
                id={leaveType.id}
                name={leaveType.name}
                color={leaveType.color}
                stats={leaveType.stats}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="numberOfDays"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Number of Days:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Reason:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Leave Type:</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>{type.id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dayPortion"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4 items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="firstHalf" id="firstHalf" />
                          <Label htmlFor="firstHalf">First Half</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="secondHalf" id="secondHalf" />
                          <Label htmlFor="secondHalf">Second Half</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From Date: DD/MM/YY</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd-MMM-yyyy, EEE")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To Date: DD/MM/YY</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd-MMM-yyyy, EEE")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <div className="flex flex-col">
              <FormLabel className="mb-2">Document:</FormLabel>
              <div className="flex items-center gap-2">
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer flex-1"
                >
                  <div className="border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500 truncate">
                      {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>
                    <Upload className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button type="submit" className="min-w-[200px]">Submit Request</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TimeOffRequestForm;
