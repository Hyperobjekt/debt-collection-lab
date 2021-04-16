import styled from "styled-components";

export default styled.div`
  @media (min-width: 960px) {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  .controls {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: 960px) {
    .side {
      max-width: 320px;
      margin-right: 2rem;
      position: sticky;
      top: 80px;
      h1 {
        margin-top: 0;
        line-height: 1.1;
      }
    }

    .controls {
      flex: 0;
      flex-direction: column;
      justify-content: flex-start;
    }
    .control {
      margin-bottom: 1rem;
    }
  }

  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
    th {
      position: sticky;
      top: 64px;
      background: #fff;
      text-align: left;
      font-size: 1.125rem;
      height: 48px;
    }
    th {
    }
    th button {
      padding: 0;
      background: none;
      border: none;
      font-size: 1.125rem;
      font-weight: bold;
      cursor: pointer;
    }
    tr td:nth-child(3) {
      padding: 0 0.5rem;
      width: 150px;
      svg {
        display: block;
      }
    }
    td {
      height: 40px;
    }

    .row--1 td:first-child {
      padding-left: 1.5rem;
    }
    .row--more {
      font-size: 0.875rem;
      color: #555;
      font-style: italic;
    }
  }
  .table--nested .row--0 {
    background: #ccc;
  }
  .table--nested .row--0 td {
    font-weight: bold;
  }
`;
