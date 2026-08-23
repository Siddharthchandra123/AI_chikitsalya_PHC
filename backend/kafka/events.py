from typing import Optional, Dict, Any
from .schemas import EventEnvelope
from .topics import EventTypes

class EventFactory:
    @staticmethod
    def create_patient_event(
        event_type: str,
        patient_id: str,
        patient_data: Dict[str, Any],
        actor_id: Optional[str] = "Health Worker",
        facility_id: Optional[int] = None,
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="patient-service",
            actor_id=actor_id,
            patient_id=patient_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=patient_data
        )

    @staticmethod
    def create_appointment_event(
        event_type: str,
        patient_id: str,
        appointment_data: Dict[str, Any],
        actor_id: Optional[str] = "System",
        facility_id: Optional[int] = None,
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="appointment-service",
            actor_id=actor_id,
            patient_id=patient_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=appointment_data
        )

    @staticmethod
    def create_referral_event(
        event_type: str,
        patient_id: str,
        referral_data: Dict[str, Any],
        actor_id: Optional[str] = "Doctor",
        facility_id: Optional[int] = None,
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="referral-service",
            actor_id=actor_id,
            patient_id=patient_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=referral_data
        )

    @staticmethod
    def create_diagnostic_event(
        event_type: str,
        patient_id: str,
        diagnostic_data: Dict[str, Any],
        actor_id: Optional[str] = "Diagnostic Staff",
        facility_id: Optional[int] = None,
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="diagnostic-service",
            actor_id=actor_id,
            patient_id=patient_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=diagnostic_data
        )

    @staticmethod
    def create_prescription_event(
        event_type: str,
        patient_id: str,
        prescription_data: Dict[str, Any],
        actor_id: Optional[str] = "Doctor",
        facility_id: Optional[int] = None,
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="pharmacy-service",
            actor_id=actor_id,
            patient_id=patient_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=prescription_data
        )

    @staticmethod
    def create_pharmacy_event(
        event_type: str,
        pharmacy_data: Dict[str, Any],
        facility_id: Optional[int] = None,
        actor_id: Optional[str] = "Pharmacist",
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="pharmacy-service",
            actor_id=actor_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=pharmacy_data
        )

    @staticmethod
    def create_followup_event(
        event_type: str,
        patient_id: str,
        followup_data: Dict[str, Any],
        actor_id: Optional[str] = "ASHA Worker",
        facility_id: Optional[int] = None,
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="followup-service",
            actor_id=actor_id,
            patient_id=patient_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=followup_data
        )

    @staticmethod
    def create_incident_event(
        event_type: str,
        incident_data: Dict[str, Any],
        facility_id: Optional[int] = None,
        actor_id: Optional[str] = "PHC Admin",
        correlation_id: Optional[str] = None
    ) -> EventEnvelope:
        return EventEnvelope(
            event_type=event_type,
            source="facility-service",
            actor_id=actor_id,
            facility_id=facility_id,
            correlation_id=correlation_id,
            data=incident_data
        )
