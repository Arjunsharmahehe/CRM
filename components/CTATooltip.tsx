import { Info } from "lucide-react";
import { Tooltip } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "./ui/button";

export function CTAInputTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="size-5 p-0">
          <Info className="size-4 text-zinc-500" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" 
        className="max-w-xs bg-background border border-foreground/40 p-2 rounded-md">
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-foreground">Link examples:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><code className="px-1 py-0.5 rounded">https://example.com</code></li>
            <li><code className="px-1 py-0.5 rounded">mailto:email@example.com</code></li>
            <li><code className="px-1 py-0.5 rounded">tel:+1234567890</code></li>
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}