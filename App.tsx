
import { useCallback, useMemo, useState } from "react";

import CampusCanvas from "./components/CampusCanvas";
import { campusRegistry } from "./data/registry";

import type {
  CampusSelection,
  CampusSceneCallbacks
} from "./types";

export default function App() {
  const [selection, setSelection] = useState<CampusSelection>({
    type: null,
    id: null
  });

  const handleBuildingSelected = useCallback((id: string) => {
    setSelection({
      type: "building",
      id
    });
  }, []);

  const handleAgentSelected = useCallback((id: string) => {
    setSelection({
      type: "agent",
      id
    });
  }, []);

  const handleGroundSelected = useCallback(() => {
    setSelection({
      type: null,
      id: null
    });
  }, []);

  const callbacks: CampusSceneCallbacks = useMemo(
    () => ({
      onBuildingSelected: handleBuildingSelected,
      onAgentSelected: handleAgentSelected,
      onGroundSelected: handleGroundSelected
    }),
    [
      handleBuildingSelected,
      handleAgentSelected,
      handleGroundSelected
    ]
  );

  const selectedBuilding = campusRegistry.buildings.find(
    (building) =>
      selection.type === "building" &&
      building.id === selection.id
  );

  const selectedAgent = campusRegistry.agents.find(
    (agent) =>
      selection.type === "agent" &&
      agent.id === selection.id
  );

  const selectedInstitution = campusRegistry.institutions.find(
    (institution) =>
      selection.type === "institution" &&
      institution.id === selection.id
  );

  const totalBuildings = campusRegistry.buildings.length;
  const totalAgents = campusRegistry.agents.length;
  const totalInstitutions = campusRegistry.institutions.length;

  return (
    <main className="app-shell" dir="rtl">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">خ</div>

          <div>
            <h1>خيرنا</h1>
            <p>الحرم الجامعي الافتراضي</p>
          </div>
        </div>

        <div className="topbar-info">
          <span className="live-indicator" />
          <span>العالم التجريبي</span>
        </div>
      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">KHAYRNA 3D CAMPUS</p>

          <h2>{campusRegistry.name}</h2>

          <p className="welcome-description">
            بيئة جامعية افتراضية ثلاثية الأبعاد لاستضافة
            المؤسسات الأكاديمية والبحثية ووكلاء الذكاء الاصطناعي.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>المؤسسات</span>
          <strong>{totalInstitutions}</strong>
        </article>

        <article className="stat-card">
          <span>المباني</span>
          <strong>{totalBuildings}</strong>
        </article>

        <article className="stat-card">
          <span>الوكلاء التجريبيون</span>
          <strong>{totalAgents}</strong>
        </article>
      </section>

      <section className="workspace">
        <div className="scene-panel">
          <div className="panel-heading">
            <div>
              <h3>استكشف الحرم</h3>
              <p>اسحب لتحريك الكاميرا واستخدم العجلة للتقريب.</p>
            </div>

            <button
              className="reset-button"
              onClick={handleGroundSelected}
            >
              إلغاء التحديد
            </button>
          </div>

          <CampusCanvas
            campus={campusRegistry}
            callbacks={callbacks}
          />

          <div className="scene-hint">
            اضغط على أي مبنى أو وكيل لعرض تفاصيله.
          </div>
        </div>

        <aside className="details-panel">
          <h3>مركز المعلومات</h3>

          {selectedBuilding && (
            <div className="details-content">
              <span className="details-type">مبنى جامعي</span>

              <h4>{selectedBuilding.name}</h4>

              <p>{selectedBuilding.description}</p>

              <div className="detail-row">
                <span>عدد الطوابق</span>
                <strong>{selectedBuilding.floors}</strong>
              </div>

              <div className="detail-row">
                <span>الجهات المستفيدة</span>
                <strong>
                  {selectedBuilding.institutionIds.length}
                </strong>
              </div>

              <div className="detail-row">
                <span>معرّف المبنى</span>
                <strong>{selectedBuilding.id}</strong>
              </div>
            </div>
          )}

          {selectedAgent && (
            <div className="details-content">
              <span className="details-type">وكيل ذكاء اصطناعي</span>

              <h4>{selectedAgent.name}</h4>

              <p>{selectedAgent.role}</p>

              <div className="detail-row">
                <span>الحالة</span>
                <strong>
                  {selectedAgent.status === "working"
                    ? "يعمل"
                    : selectedAgent.status === "moving"
                      ? "يتحرك"
                      : "متاح"}
                </strong>
              </div>

              <div className="detail-row">
                <span>المؤسسة</span>
                <strong>{selectedAgent.institutionId}</strong>
              </div>
            </div>
          )}

          {selectedInstitution && (
            <div className="details-content">
              <span className="details-type">مؤسسة أكاديمية</span>

              <h4>{selectedInstitution.name}</h4>

              <p>{selectedInstitution.description}</p>

              <div className="detail-row">
                <span>عدد المباني المرتبطة</span>
                <strong>
                  {selectedInstitution.buildingIds.length}
                </strong>
              </div>
            </div>
          )}

          {!selectedBuilding &&
            !selectedAgent &&
            !selectedInstitution && (
              <div className="empty-selection">
                <div className="empty-icon">⌖</div>

                <h4>لم يتم اختيار عنصر</h4>

                <p>
                  اختر مبنى أو وكيلًا من المشهد ثلاثي الأبعاد
                  لعرض معلوماته هنا.
                </p>
              </div>
            )}
        </aside>
      </section>

      <footer className="app-footer">
        <span>KHAYRNA 3D CAMPUS</span>
        <span>الإصدار التجريبي 0.1.0</span>
      </footer>
    </main>
  );
}
