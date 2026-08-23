class KafkaTopics:
    PATIENT_EVENTS = "patient.events"
    APPOINTMENT_EVENTS = "appointment.events"
    CONSULTATION_EVENTS = "consultation.events"
    REFERRAL_EVENTS = "referral.events"
    DIAGNOSTIC_EVENTS = "diagnostic.events"
    PRESCRIPTION_EVENTS = "prescription.events"
    PHARMACY_EVENTS = "pharmacy.events"
    FOLLOWUP_EVENTS = "followup.events"
    NOTIFICATION_EVENTS = "notification.events"
    FACILITY_EVENTS = "facility.events"
    ANALYTICS_EVENTS = "analytics.events"

    @staticmethod
    def get_dlt_topic(base_topic: str) -> str:
        """Returns dead-letter topic name for a base topic."""
        return f"{base_topic}.DLT"

class EventTypes:
    PATIENT_CREATED = "patient.created"
    PATIENT_UPDATED = "patient.updated"
    
    APPOINTMENT_CREATED = "appointment.created"
    APPOINTMENT_UPDATED = "appointment.updated"
    APPOINTMENT_CANCELLED = "appointment.cancelled"
    APPOINTMENT_COMPLETED = "appointment.completed"
    
    CONSULTATION_CREATED = "consultation.created"
    CONSULTATION_COMPLETED = "consultation.completed"
    
    REFERRAL_CREATED = "referral.created"
    REFERRAL_ACCEPTED = "referral.accepted"
    REFERRAL_REJECTED = "referral.rejected"
    REFERRAL_PATIENT_SEEN = "referral.patient_seen"
    REFERRAL_COMPLETED = "referral.completed"
    
    DIAGNOSTIC_REQUESTED = "diagnostic.requested"
    DIAGNOSTIC_RESULT_AVAILABLE = "diagnostic.result.available"
    
    PRESCRIPTION_CREATED = "prescription.created"
    INVENTORY_UPDATED = "inventory.updated"
    
    FOLLOWUP_CREATED = "followup.created"
    FOLLOWUP_COMPLETED = "followup.completed"
    FOLLOWUP_MISSED = "followup.missed"
    
    NOTIFICATION_REQUESTED = "notification.requested"
    INCIDENT_REPORTED = "facility.incident.reported"
