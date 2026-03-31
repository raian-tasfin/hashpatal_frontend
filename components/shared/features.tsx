import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  FileText as FileTextIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
} from "lucide-react";

/**
 * Features Description
 */
const features = [
  {
    icon: CalendarIcon,
    title: "Easy Appointment Booking",
    description:
      "Schedule appointments with your preferred doctors in just a few clicks.",
  },
  {
    icon: FileTextIcon,
    title: "Digital Medical Records",
    description:
      "Access your complete medical history, prescriptions, and lab results anytime.",
  },
  {
    icon: UsersIcon,
    title: "Expert Healthcare Team",
    description:
      "Connect with certified specialists across various medical departments.",
  },
  {
    icon: ShieldIcon,
    title: "Secure & Private",
    description:
      "Your health data is protected with enterprise-grade security measures.",
  },
  {
    icon: ClockIcon,
    title: "24/7 Access",
    description:
      "Manage your healthcare needs round the clock from any device.",
  },
];

/**
 * Features Section Component
 */
export default function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need for Better Health Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
