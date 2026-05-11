-- =============================================================================
-- ERD v5 user condition detail storage
-- =============================================================================
-- Stores user-entered condition values for a simulation session. The relation is
-- one-to-one with simulation_session so session metadata and detailed user inputs
-- remain separated.
-- =============================================================================

CREATE TABLE user_condition (
    user_condition_id     BIGSERIAL PRIMARY KEY,
    session_id            BIGINT NOT NULL UNIQUE REFERENCES simulation_session (session_id) ON DELETE CASCADE,
    current_district      VARCHAR(64),
    compare_district      VARCHAR(64),
    monthly_income        INTEGER,
    monthly_housing       INTEGER,
    monthly_living        INTEGER,
    commute_time          INTEGER,
    childcare_cost        INTEGER,
    return_to_work_months INTEGER,
    retirement_age        INTEGER,
    savings               INTEGER
);

CREATE INDEX idx_user_condition_session ON user_condition (session_id);
